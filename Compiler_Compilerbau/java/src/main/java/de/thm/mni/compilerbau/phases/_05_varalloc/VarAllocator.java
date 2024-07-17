package de.thm.mni.compilerbau.phases._05_varalloc;

import de.thm.mni.compilerbau.CommandLineOptions;
import de.thm.mni.compilerbau.absyn.*;
import de.thm.mni.compilerbau.table.*;
import de.thm.mni.compilerbau.types.PrimitiveType;
import de.thm.mni.compilerbau.utils.*;

import java.util.*;
import java.util.stream.IntStream;

/**
 * This class is used to calculate the memory needed for variables and stack frames of the currently compiled SPL program.
 * Those value have to be stored in their corresponding fields in the {@link ProcedureEntry}, {@link VariableEntry} and
 * {@link ParameterType} classes.
 */
public class VarAllocator {
    public static final int WORD_BYTESIZE = 4;

    private final CommandLineOptions options;

    private boolean isLeaf = true;

    // Array zugriff wie checken -> in der check Methode
    // wo überall offset bestimmen -> woher inconsistent -> noch bei parameter types i guess

    /**
     * @param options The options passed to the compiler
     */
    public VarAllocator(CommandLineOptions options) {
        this.options = options;
    }


    public void allocVars(Program program, SymbolTable table) {
        //TODO (assignment 5): Allocate stack slots for all parameters and local variables

        for(GlobalDeclaration globalDec : program.declarations) {
            switch (globalDec){
                case ProcedureDeclaration procedureDeclaration-> {
                    calcOffsets(procedureDeclaration, table);
                }
                default -> {}
            }
        }

        if(true) formatVars(program, table); // if(showVarAlloc) ?
    }

    public void calcOffsets(ProcedureDeclaration procDec, SymbolTable table) {

        ProcedureEntry procedureEntry = (ProcedureEntry) table.lookup(procDec.name);
        SymbolTable localTable = procedureEntry.localTable;

        int calcedOffset = 0;
        for(ParameterDeclaration parameterDeclaration : procDec.parameters){
            VariableEntry variableEntry = (VariableEntry) procedureEntry.localTable.lookup(parameterDeclaration.name);
            variableEntry.offset = calcedOffset;
            calcedOffset += WORD_BYTESIZE;
        }

        procedureEntry.stackLayout.argumentAreaSize = procDec.parameters.size() * WORD_BYTESIZE;

        calcedOffset = 0;
        for (ParameterType parameterType : procedureEntry.parameterTypes) {

            parameterType.offset = calcedOffset;
            calcedOffset += WORD_BYTESIZE;
        }

        procedureEntry.stackLayout.localVarAreaSize = 0;
        calcedOffset = 0;
        for(VariableDeclaration variableDeclaration : procDec.variables) {

            Entry entry = localTable.lookup(variableDeclaration.name);

                switch (entry) {
                    case VariableEntry variableEntry -> {

                        procedureEntry.stackLayout.localVarAreaSize += variableEntry.type.byteSize;

                        calcedOffset += variableEntry.type.byteSize;
                        variableEntry.offset = -calcedOffset;
                    }
                    default -> {
                    }
                }
        }

        //is the Procedure a Leaf -> has no ProcCall
        procedureEntry.stackLayout.outgoingAreaSize = getBiggestOutgoing(procDec.body);
        procedureEntry.stackLayout.isLeafProc = isLeaf;

    }


    public int getBiggestOutgoing(List<Statement> statements){

        int biggestOutgoing = 0;
        isLeaf = true;

        for(Statement statement : statements){
            switch (statement){
                case CallStatement callStatement -> {
                    int outgoing = callStatement.arguments.size() * PrimitiveType.intType.byteSize;
                    biggestOutgoing = Math.max(outgoing, biggestOutgoing);
                    isLeaf = false;
                }
                case CompoundStatement compoundStatement -> {
                    biggestOutgoing = Math.max(getBiggestOutgoing(compoundStatement.statements), biggestOutgoing);
                }
                case WhileStatement whileStatement -> {
                    biggestOutgoing = Math.max(getBiggestOutgoing(List.of(whileStatement.body)), biggestOutgoing);
                }
                case IfStatement ifStatement -> {
                    int outgoing =  Math.max(getBiggestOutgoing(List.of(ifStatement.elsePart)) , getBiggestOutgoing(List.of(ifStatement.thenPart)));
                    biggestOutgoing = Math.max(outgoing, biggestOutgoing);
                }
                default -> {}
            }
        }

        return biggestOutgoing;
    }



    /**
     * Formats and prints the variable allocation to a human-readable format
     * The stack layout
     *
     * @param program The abstract syntax tree of the program
     * @param table   The symbol table containing all symbols of the spl program
     */
    private static void formatVars(Program program, SymbolTable table) {
        program.declarations.stream().filter(dec -> dec instanceof ProcedureDeclaration).map(dec -> (ProcedureDeclaration) dec).forEach(procDec -> {
            ProcedureEntry entry = (ProcedureEntry) table.lookup(procDec.name);

            var isLeafOptimized = entry.stackLayout.isOptimizedLeafProcedure;
            var varparBasis = (isLeafOptimized ? "SP" : "FP");

            AsciiGraphicalTableBuilder ascii = new AsciiGraphicalTableBuilder();
            ascii.line("...", AsciiGraphicalTableBuilder.Alignment.CENTER);

            {
                final var zipped = IntStream.range(0, procDec.parameters.size()).boxed()
                        .map(i -> new Pair<>(procDec.parameters.get(i), new Pair<>(((VariableEntry) entry.localTable.lookup(procDec.parameters.get(i).name)), entry.parameterTypes.get(i))))
                        .sorted(Comparator.comparing(p -> Optional.ofNullable(p.second.first.offset).map(o -> -o).orElse(Integer.MIN_VALUE)));

                zipped.forEach(v -> {
                    boolean consistent = Objects.equals(v.second.first.offset, v.second.second.offset);

                    ascii.line("par " + v.first.name.toString(), "<- " + varparBasis + " + " +
                                    (consistent ?
                                            StringOps.toString(v.second.first.offset) :
                                            String.format("INCONSISTENT(%s/%s)",
                                                    StringOps.toString(v.second.first.offset),
                                                    StringOps.toString(v.second.second.offset))),
                            AsciiGraphicalTableBuilder.Alignment.LEFT);
                });
            }

            ascii.sep("BEGIN", "<- " + varparBasis);
            if (!procDec.variables.isEmpty()) {
                procDec.variables.stream()
                        .map(v -> new AbstractMap.SimpleImmutableEntry<>(v, ((VariableEntry) entry.localTable.lookup(v.name))))
                        .sorted(Comparator.comparing(e -> Try.execute(() -> -e.getValue().offset).getOrElse(0)))
                        .forEach(v -> ascii.line("var " + v.getKey().name.toString(),
                                "<- " + varparBasis + " - " + Optional.ofNullable(v.getValue().offset).map(o -> -o).map(StringOps::toString).orElse("NULL"),
                                AsciiGraphicalTableBuilder.Alignment.LEFT));

                if (!isLeafOptimized) ascii.sep("");
            }

            if (isLeafOptimized) ascii.close("END");
            else {
                ascii.line("Old FP",
                        "<- SP + " + Try.execute(entry.stackLayout::oldFramePointerOffset).map(Objects::toString).getOrElse("UNKNOWN"),
                        AsciiGraphicalTableBuilder.Alignment.LEFT);

                ascii.line("Old Return",
                        "<- FP - " + Try.execute(() -> -entry.stackLayout.oldReturnAddressOffset()).map(Objects::toString).getOrElse("UNKNOWN"),
                        AsciiGraphicalTableBuilder.Alignment.LEFT);

                if (entry.stackLayout.outgoingAreaSize == null || entry.stackLayout.outgoingAreaSize > 0) {

                    ascii.sep("outgoing area");

                    if (entry.stackLayout.outgoingAreaSize != null) {
                        var max_args = entry.stackLayout.outgoingAreaSize / 4;

                        for (int i = 0; i < max_args; ++i) {
                            ascii.line(String.format("arg %d", max_args - i),
                                    String.format("<- SP + %d", (max_args - i - 1) * 4),
                                    AsciiGraphicalTableBuilder.Alignment.LEFT);
                        }
                    } else {
                        ascii.line("UNKNOWN SIZE", AsciiGraphicalTableBuilder.Alignment.LEFT);
                    }
                }

                ascii.sep("END", "<- SP");
                ascii.line("...", AsciiGraphicalTableBuilder.Alignment.CENTER);
            }

            System.out.printf("Variable allocation for procedure '%s':\n", procDec.name);
            System.out.printf("  - size of argument area = %s\n", StringOps.toString(entry.stackLayout.argumentAreaSize));
            System.out.printf("  - size of localvar area = %s\n", StringOps.toString(entry.stackLayout.localVarAreaSize));
            System.out.printf("  - size of outgoing area = %s\n", StringOps.toString(entry.stackLayout.outgoingAreaSize));
            System.out.printf("  - frame size = %s\n", Try.execute(entry.stackLayout::frameSize).map(Objects::toString).getOrElse("UNKNOWN"));
            System.out.println();
            if (isLeafOptimized) System.out.println("  Stack layout (leaf optimized):");
            else System.out.println("  Stack layout:");
            System.out.println(StringOps.indent(ascii.toString(), 4));
            System.out.println();
        });
    }
}
