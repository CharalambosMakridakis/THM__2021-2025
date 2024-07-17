package de.thm.mni.compilerbau.phases._06_codegen;

import de.thm.mni.compilerbau.CommandLineOptions;
import de.thm.mni.compilerbau.absyn.*;
import de.thm.mni.compilerbau.phases._05_varalloc.StackLayout;
import de.thm.mni.compilerbau.table.*;
import de.thm.mni.compilerbau.types.ArrayType;
import de.thm.mni.compilerbau.types.PrimitiveType;
import de.thm.mni.compilerbau.utils.SplError;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * This class is used to generate the assembly code for the compiled program.
 * This code is emitted via the {@link CodePrinter} in the output field of this class.
 */
public class CodeGenerator {
    final CommandLineOptions options;
    final CodePrinter output;
    private Register currentRegister = new Register(8);
    private final Register FRAME_POINTER_REGISTER = new Register(25);
    private final Register STACK_POINTER_REGISTER = new Register(29);
    private final Register RETURN_ADDRESS_REGISTER = new Register(31);
    private final Register NULL_REGISTER = new Register(0);

    private String firstLabel;
    //private String secondLabel;

    private int labelIndex = 0;

    private boolean isForCallStatement = false;

    /**
     * Initializes the code generator.
     *
     * @param options The command line options passed to the compiler
     * @param output  The PrintWriter to the output file.
     */
    public CodeGenerator(CommandLineOptions options, PrintWriter output) throws IOException {
        this.options = options;
        this.output = new CodePrinter(output);
    }

    public void generateCode(Program program, SymbolTable table) {
        assemblerProlog();
        program.declarations.forEach(x -> traverseTree(x, table));
        //TODO (assignment 6): generate eco32 assembler code for the spl program

    }

    private String nextLabel(){
        return "L" + labelIndex++;
    }

    private void traverseTree(Node node, SymbolTable table) {
        switch(node){
            case TypeDeclaration typeDeclaration -> {
            }
            case ProcedureDeclaration procedureDeclaration -> {
                generateProcedureDeclaration(procedureDeclaration, table);
            }
            case default -> {
                System.out.println("Fehler");
            }
        }
    }

    private void generateProcedureDeclaration(ProcedureDeclaration procedureDeclaration, SymbolTable table) {
        ProcedureEntry procedureEntry = (ProcedureEntry) table.lookup(procedureDeclaration.name);
        prologForProc(procedureDeclaration.name, procedureEntry.stackLayout);

        procedureDeclaration.body.forEach(statement -> generateStatement(statement, procedureEntry.localTable));

        epilogForProc(procedureEntry.stackLayout);
    }

    public void generateStatement(Statement statement, SymbolTable table) {
        switch (statement) {
            case CompoundStatement compoundStatement -> {
                compoundStatement.statements.forEach(s -> generateStatement(s, table));
            }
            case IfStatement ifStatement -> {

                currentRegister = new Register(7);

                switch (ifStatement.elsePart) {
                    case EmptyStatement eS-> {

                        firstLabel = nextLabel();

                        isRightSide = true;
                        generateExpression(ifStatement.condition, table);
                        isRightSide = false;

                        generateStatement(ifStatement.thenPart, table);

                        output.emitLabel(firstLabel);
                    }
                    case default -> {

                        String firstLabelOwn =  nextLabel();
                        String secondLabel = nextLabel();
                        firstLabel = firstLabelOwn;

                        isRightSide = true;
                        generateExpression(ifStatement.condition, table);
                        isRightSide = false;

                        generateStatement(ifStatement.thenPart, table);

                        output.emitInstruction("j", secondLabel);
                        output.emitLabel(firstLabelOwn);


                        generateStatement(ifStatement.elsePart, table);

                        output.emitLabel(secondLabel);

                    }
                }

            }
            case WhileStatement whileStatement -> {

                currentRegister = new Register(7);

                String secondLabel = nextLabel();
                String firstLabelOwn = nextLabel();
                firstLabel = firstLabelOwn;

                output.emitLabel(secondLabel);

                isRightSide = true;
                generateExpression(whileStatement.condition, table);
                isRightSide = false;

                generateStatement(whileStatement.body, table);

                output.emitInstruction("j", secondLabel);

                output.emitLabel(firstLabelOwn);

            }
            case AssignStatement assignStatement -> {
                generateAssignStatement(table, assignStatement);
            }
            case CallStatement callStatement -> {
                //callStatement.arguments.forEach(argument -> generateExpression(argument, table));
                //Stack<ParameterType> stack = new Stack<>();
                ProcedureEntry procedureEntryCallee = (ProcedureEntry) table.lookup(callStatement.procedureName);

                for(int index = 0; index < procedureEntryCallee.parameterTypes.size(); index++) {

                    currentRegister = new Register(7);


                    isForCallStatement = procedureEntryCallee.parameterTypes.get(index).isReference;

                    isRightSide = true;
                    generateExpression(callStatement.arguments.get(index), table);
                    isRightSide = false;

                    isForCallStatement = false;

                    output.emitInstruction("stw", currentRegister, STACK_POINTER_REGISTER, procedureEntryCallee.parameterTypes.get(index).offset, "store argument #" + index);
                    currentRegister = currentRegister.previous();

                }

                output.emitInstruction("jal", callStatement.procedureName.toString());
            }
            case EmptyStatement emptyStatement -> {}
        }
    }

    private boolean isRightSide = false;
    private void generateAssignStatement(SymbolTable table, AssignStatement assignStatement) {

        int targetOffset = 0;

        switch (assignStatement.target) {
            case NamedVariable namedVariable-> {
                VariableEntry variableEntry = (VariableEntry) table.lookup(namedVariable.name);
                targetOffset = variableEntry.offset;

                //wer mich auf diese Zeile anspricht wird hochgenommen!!!
                //nicht von mir muss von Charalambos Makridakis sein :)
                if (currentRegister.number < 8) currentRegister = currentRegister.nextRegister();

                if(variableEntry.isReference){
                    output.emitInstruction("add", currentRegister , FRAME_POINTER_REGISTER, targetOffset );
                    output.emitInstruction("ldw", currentRegister , currentRegister, 0);

                }else {
                    output.emitInstruction("add", currentRegister, FRAME_POINTER_REGISTER, targetOffset);
                }

            }
            case ArrayAccess arrayAccess -> {
                generateArrayAccess(arrayAccess, table);
                //TODO: ArrayAccess offset
            }
        }

        isRightSide = true;
        generateExpression(assignStatement.value, table);
        isRightSide = false;

        output.emitInstruction("stw", currentRegister, currentRegister = currentRegister.previousRegister(), 0);
    }

    public void generateExpression(Expression e, SymbolTable table) {

        switch(e) {
            case BinaryExpression binaryExpression -> {
                generateExpression(binaryExpression.leftOperand, table);
                generateExpression(binaryExpression.rightOperand, table);


                String operator = switch (binaryExpression.operator) {
                                    case ADD -> "add";
                                    case SUB -> "sub";
                                    case MUL -> "mul";
                                    case DIV -> "div";
                                    case EQU -> "beq";
                                    case NEQ -> "bne";
                                    case LST -> "blt";
                                    case LSE -> "ble";
                                    case GRT -> "bgt";
                                    case GRE -> "bge";
                                };

                if(binaryExpression.operator.isComparison()){
                    switch (binaryExpression.operator){
                        case EQU -> {
                            output.emitInstruction("bne", currentRegister.previous(), currentRegister, firstLabel);
                        }
                        case NEQ -> {
                            output.emitInstruction("beq", currentRegister.previousRegister(), currentRegister, firstLabel);
                        }
                        case LST -> {
                            output.emitInstruction("bge", currentRegister.previousRegister(), currentRegister, firstLabel);
                        }
                        case LSE -> {
                            output.emitInstruction("bgt", currentRegister.previousRegister(), currentRegister, firstLabel);
                        }
                        case GRT -> {
                            output.emitInstruction("ble", currentRegister.previousRegister(), currentRegister, firstLabel);
                        }
                        case GRE -> {
                            output.emitInstruction("blt", currentRegister.previousRegister(), currentRegister, firstLabel);
                        }
                        default -> {
                            System.out.println("Fehler");
                        }
                    }
                    currentRegister = currentRegister.previousRegister();
                }else{
                    output.emitInstruction(operator, currentRegister = currentRegister.previousRegister(), currentRegister, currentRegister.nextRegister());
                }

            }
            case UnaryExpression unaryExpression -> {
                // -------------9
                generateExpression(unaryExpression.operand, table);
            }
            case VariableExpression variableExpression -> {
                switch (variableExpression.variable) {
                    case ArrayAccess arrayAccess -> {
                        generateArrayAccess(arrayAccess, table);
                    }
                    case NamedVariable namedVariable -> {
                        VariableEntry variableEntry = (VariableEntry) table.lookup(namedVariable.name);

                        if (isForCallStatement) {

                            output.emitInstruction("add", currentRegister = currentRegister.nextRegister(), FRAME_POINTER_REGISTER, variableEntry.offset);

                            //not sure
                            if(variableEntry.isReference){
                                output.emitInstruction("ldw", currentRegister, currentRegister, 0);
                            }

                            return;
                        }

                        if(isRightSide) {
                            output.emitInstruction("add", currentRegister = currentRegister.nextRegister(), FRAME_POINTER_REGISTER, variableEntry.offset);
                            output.emitInstruction("ldw", currentRegister, currentRegister, 0 );
                        }

                        if(variableEntry.isReference){
                            output.emitInstruction("ldw", currentRegister, currentRegister, 0);
                        }
                    }
                }
            }
            case IntLiteral intLiteral -> {

                currentRegister = currentRegister.nextRegister();

                output.emitInstruction("add", currentRegister, new Register(0), intLiteral.value);
            }
        }
    }

    private Identifier getArrayName(ArrayAccess arrayAccess){
        return  switch (arrayAccess.array) {
            case ArrayAccess arrayAccess1 -> getArrayName(arrayAccess1);
            case NamedVariable namedVariable -> namedVariable.name;
        };
    }

    private ArrayType getArrayType(ArrayAccess arrayAccess){
        return  switch (arrayAccess.array) {
            case ArrayAccess arrayAccess1 -> getArrayType(arrayAccess1);
            case NamedVariable namedVariable -> (ArrayType) namedVariable.dataType;
        };
    }


    private int arrayDepth = 0;
    private List<ArrayAccess> getArrayAccessStack(ArrayAccess arrayAccess) {
        List<ArrayAccess> queue = new ArrayList<>();
        queue.add(arrayAccess);
        while (!(arrayAccess.array instanceof NamedVariable)) {
            queue.add((ArrayAccess) arrayAccess.array);
            arrayAccess = (ArrayAccess) arrayAccess.array;
        }
        Collections.reverse(queue);
        return queue;
    }

    private void generateArrayAccess(ArrayAccess arrayAccess, SymbolTable table) {
        boolean wasRight = isRightSide;
        var ident = getArrayName(arrayAccess);
        //Identifier
        VariableEntry variableEntry = (VariableEntry) table.lookup(ident);

        if(isRightSide) currentRegister = currentRegister.nextRegister();
        output.emitInstruction("add", currentRegister, FRAME_POINTER_REGISTER, variableEntry.offset);

        if(variableEntry.isReference)
            output.emitInstruction("ldw", currentRegister, currentRegister, 0);

        List<ArrayAccess> queue = getArrayAccessStack(arrayAccess);

        trigger = true;

        generatePartialArrayAccess(Objects.requireNonNull(queue.remove(0)), table);


        arrayDepth++;
        while (!queue.isEmpty()) {

            generatePartialArrayAccess(Objects.requireNonNull(queue.remove(0)), table);
            arrayAccess = (ArrayAccess) arrayAccess.array;
            arrayDepth++;
        }

        if(wasRight) output.emitInstruction("ldw", currentRegister, currentRegister, 0); //maybe?
            //output.emitInstruction("ldw", currentRegister, currentRegister, 0); //maybe?

        arrayDepth = 0;
    }

    private boolean trigger = true;

    private void generatePartialArrayAccess(ArrayAccess arrayAccess, SymbolTable table) {

        if((!trigger) && isRightSide) {
            currentRegister = currentRegister.nextRegister();
        }

        trigger = false;

        isRightSide = true;
        generateExpression(arrayAccess.index, table);
        isRightSide = false;

        ArrayType arrayType = (ArrayType) ((VariableEntry) table.lookup(getArrayName(arrayAccess))).type;

        output.emitInstruction("add", currentRegister.nextRegister(), NULL_REGISTER, calculateArrayOffset(arrayType)); // TODO arraySize needs to be eval recursively
        output.emitInstruction("bgeu", currentRegister, currentRegister.nextRegister(), "_indexError");
        output.emitInstruction("mul", currentRegister, currentRegister, getArraySizeInBytes(arrayType));
        output.emitInstruction("add", currentRegister = currentRegister.previousRegister(), currentRegister, currentRegister.nextRegister()); //TODO

    }

    private int calculateArrayOffset(ArrayType arrayType) {
        int tmpDepth = arrayDepth;
        while (tmpDepth > 0 && arrayType.baseType != PrimitiveType.intType) {
            arrayType = (ArrayType) arrayType.baseType;
            tmpDepth--;
        }

        return arrayType.arraySize;
    }

    private int getArraySizeInBytes(ArrayType arrayType) {
        int tmpDepth = arrayDepth;
        while(tmpDepth > 0 && arrayType.baseType != null && arrayType.baseType != PrimitiveType.intType) {
            arrayType = (ArrayType) arrayType.baseType;
            tmpDepth--;
        }
        assert arrayType.baseType != null;
        return arrayType.baseType.byteSize;
    }

    public void prologForProc(Identifier procedureName, StackLayout stackLayout) {
        output.emit("");
        output.emitExport(procedureName.toString());
        output.emitLabel(procedureName.toString());
        output.emitInstruction("sub", new Register(29), new Register(29), stackLayout.frameSize(), "allocate frame");
        output.emitInstruction("stw", new Register(25), new Register(29), stackLayout.oldFramePointerOffset(), "save old frame pointer");
        output.emitInstruction("add", new Register(25), new Register(29), stackLayout.frameSize(), "setup new frame pointer");
        output.emitInstruction("stw", new Register(31), new Register(25), stackLayout.oldReturnAddressOffset(), "save return register");
    }

    public void epilogForProc(StackLayout stackLayout) {
        output.emitInstruction("ldw", new Register(31), new Register(25), stackLayout.oldReturnAddressOffset(), "restore return register");
        output.emitInstruction("ldw", new Register(25), new Register(29), stackLayout.oldFramePointerOffset(), "restore old frame pointer");
        output.emitInstruction("add", new Register(29), new Register(29), stackLayout.frameSize(), "release frame");
        output.emitInstruction("jr", new Register(31), "return");
    }
    


    /**
     * Emits needed import statements, to allow usage of the predefined functions and sets the correct settings
     * for the assembler.
     */
    private void assemblerProlog() {
        output.emitImport("printi");
        output.emitImport("printc");
        output.emitImport("readi");
        output.emitImport("readc");
        output.emitImport("exit");
        output.emitImport("time");
        output.emitImport("clearAll");
        output.emitImport("setPixel");
        output.emitImport("drawLine");
        output.emitImport("drawCircle");
        output.emitImport("_indexError");
        output.emit("");
        output.emit("\t.code");
        output.emit("\t.align\t4");
    }
}
