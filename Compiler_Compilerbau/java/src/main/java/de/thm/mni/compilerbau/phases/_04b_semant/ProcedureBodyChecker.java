package de.thm.mni.compilerbau.phases._04b_semant;

import de.thm.mni.compilerbau.CommandLineOptions;
import de.thm.mni.compilerbau.absyn.*;
import de.thm.mni.compilerbau.table.*;
import de.thm.mni.compilerbau.types.ArrayType;
import de.thm.mni.compilerbau.types.PrimitiveType;
import de.thm.mni.compilerbau.types.Type;
import de.thm.mni.compilerbau.utils.SplError;

import java.util.Arrays;
import java.util.Objects;

/**
 * This class is used to check if the currently compiled SPL program is semantically valid.
 * The body of each procedure has to be checked, consisting of {@link Statement}s, {@link Variable}s and {@link Expression}s.
 * Each node has to be checked for type issues or other semantic issues.
 * Calculated {@link Type}s can be stored in and read from the dataType field of the {@link Expression} and {@link Variable} classes.
 */

public class ProcedureBodyChecker {

    private final CommandLineOptions options;

    public ProcedureBodyChecker(CommandLineOptions options) {
        this.options = options;
    }

    public void checkProcedures(Program program, SymbolTable globalTable) {

        Entry main = globalTable.lookup(new Identifier("main"));
        if (Objects.isNull(main))
            throw SplError.MainIsMissing();

        switch (main) {
            case ProcedureEntry procedureEntry -> {
                if (procedureEntry.parameterTypes.size() != 0)
                    throw SplError.MainMustNotHaveParameters();
            }
            default -> throw SplError.MainIsNotAProcedure();
        }

        program.declarations.forEach((x) -> checkNode(x, globalTable));
    }

    public void checkNode(Node start, SymbolTable global) {
        switch (start) {
            case ProcedureDeclaration procDef -> {
                procDef.body.forEach((x) -> {
                    check(x, ((ProcedureEntry) global.lookup(procDef.name)).localTable);
                });
            }
            default -> {}
        }
    }

    public void check(Node start, SymbolTable localTable) {
        switch (start) {
            case AssignStatement asgn -> {
                switch (asgn.target) {
                    case NamedVariable nmd -> {
                        if (isArray(nmd, localTable, 1))
                            throw SplError.IllegalAssignmentToArray(nmd.position);
                        if (setTypes(asgn.value, localTable) != PrimitiveType.intType)
                            throw SplError.IllegalAssignment(nmd.position, PrimitiveType.intType, asgn.value.dataType);
                    }
                    case ArrayAccess arac -> {
                        if (!isArray(arac, localTable, 1))
                            throw SplError.IndexingNonArray(arac.position);
                        if (setTypes(arac.index, localTable) != PrimitiveType.intType)
                            throw SplError.IndexingWithNonInteger(arac.position);
                        if (setTypes(asgn.value, localTable) != PrimitiveType.intType)
                            throw SplError.IllegalAssignment(arac.position, PrimitiveType.intType, asgn.value.dataType);
                    }
                }
            }
            case IfStatement ifStatement -> {
                if(setTypes(ifStatement.condition, localTable) != PrimitiveType.boolType)
                    throw SplError.IfConditionMustBeBoolean(ifStatement.position, ifStatement.condition.dataType);
                check(ifStatement.elsePart, localTable);
                check(ifStatement.thenPart, localTable);
            }
            case WhileStatement whileStatement -> {
                if(setTypes(whileStatement.condition, localTable) != PrimitiveType.boolType)
                    throw SplError.WhileConditionMustBeBoolean(whileStatement.position, whileStatement.condition.dataType);
                check(whileStatement.body, localTable);
            }
            case CompoundStatement compoundStatement -> {
                compoundStatement.statements.forEach(x -> check(x, localTable));
            }
            case CallStatement callStatement -> {

                Entry entry = localTable.lookup(callStatement.procedureName);
                if(Objects.isNull(entry))
                    throw SplError.UndefinedProcedure(callStatement.position, callStatement.procedureName);

                switch (entry) {
                    case ProcedureEntry procEntry -> {}
                    default -> throw SplError.CallOfNonProcedure(callStatement.position, callStatement.procedureName);
                }

                ProcedureEntry procedureEntry = (ProcedureEntry) localTable.lookup(callStatement.procedureName);

                if (callStatement.arguments.size() > procedureEntry.parameterTypes.size())
                    throw SplError.TooManyArguments(callStatement.position, callStatement.procedureName);

                if (callStatement.arguments.size() < procedureEntry.parameterTypes.size())
                    throw SplError.TooFewArguments(callStatement.position, callStatement.procedureName);

                for (int i = 0; i < procedureEntry.parameterTypes.size(); i++) {
                    ParameterType par = procedureEntry.parameterTypes.get(i);
                    Expression ex = callStatement.arguments.get(i);
                    if (setTypes(ex, localTable) != par.type) {
                        throw SplError.ArgumentTypeMismatch(callStatement.position, callStatement.procedureName, i + 1, par.type, ex.dataType);
                    }
                    if (par.isReference) {
                        switch (ex) {
                            case VariableExpression varExp -> {

                                switch (varExp.variable){
                                    case NamedVariable namedVariable -> {

                                        Entry var  = localTable.lookup(namedVariable.name);
                                        if(Objects.isNull(var))
                                            throw SplError.UndefinedVariable(ex.position, namedVariable.name);

                                        switch (var){
                                            case VariableEntry variableEntry-> {}
                                            default -> throw SplError.ArgumentMustBeAVariable(ex.position, namedVariable.name, i + 1);
                                        }

                                    }
                                    case ArrayAccess arrayAccess -> {
                                        isArray(arrayAccess, localTable, 1);
                                        if (setTypes(arrayAccess.index, localTable) != PrimitiveType.intType){
                                            throw SplError.IndexingWithNonInteger(arrayAccess.position);
                                        }
                                    }
                                }
                            }
                            case IntLiteral intLit -> {
                                throw SplError.ArgumentMustBeAVariable(ex.position, callStatement.procedureName, i + 1);
                            }
                            default -> throw SplError.MustBeAReferenceParameter(ex.position, callStatement.procedureName);
                        }
                    }
                }
            }
            case EmptyStatement emptyStatement -> {

            }

            default -> {System.out.println("DEFAULLLTTTT");}
        }
    }

    public boolean isArray(NamedVariable nmd, SymbolTable localTable, int accessCount) {
        if (Objects.isNull(localTable.lookup(nmd.name))) throw SplError.UndefinedVariable(nmd.position, nmd.name);

        VariableEntry var = (VariableEntry) localTable.lookup(nmd.name);
        switch (var.type) { // LMAOOOOOOO SOOO CLEAN UND SMART!!!!!!
            case ArrayType arT -> {
                //falls faxen hier einfach Typentiefe berechnen
                long arrayDimension = (Arrays.stream(arT.baseType.toString().toLowerCase().split(" ")).filter(x -> x.contains("array")).count()) + 1;
                if(accessCount > arrayDimension) throw SplError.IndexingNonArray(nmd.position);
                if (accessCount < arrayDimension) throw SplError.IllegalAssignmentToArray(nmd.position);
                return true;
            }
            default -> {
                return false;
            }
        }
    }

    public boolean isArray(ArrayAccess arac, SymbolTable global, int accessCount) {
        switch (arac.array) {
            case ArrayAccess ac -> {
                return isArray(ac, global, accessCount + 1);
            }
            case NamedVariable nv -> {
                return isArray(nv, global, accessCount);
            }
            default -> {
                return false;
            }
        }
    }
    public Type setTypes(Expression exp, SymbolTable sb) {
        switch (exp) {
            case BinaryExpression binaryExp -> {
                if (binaryExp.operator.isArithmetic()) {
                    Type first = setTypes(binaryExp.leftOperand, sb);
                    Type second = setTypes(binaryExp.rightOperand, sb);
                    if(first != second || first != PrimitiveType.intType) {
                        throw SplError.NoSuchOperator(binaryExp.position, binaryExp.operator, first, second);
                    }
                    return binaryExp.dataType = PrimitiveType.intType;
                } else if (binaryExp.operator.isEqualityOperator()) { // isEquality -> Bool und Int OK
                    Type first = setTypes(binaryExp.leftOperand, sb);
                    Type second = setTypes(binaryExp.rightOperand, sb);
                    if(first != second) {
                        throw SplError.NoSuchOperator(binaryExp.position, binaryExp.operator, first, second);
                    }
                    return binaryExp.dataType = PrimitiveType.boolType;
                } else if (binaryExp.operator.isComparison()) { // isComparison -> Darf nur Int sein da True < False error
                    Type first = setTypes(binaryExp.leftOperand, sb);
                    Type second = setTypes(binaryExp.rightOperand, sb);
                    if(first != second || first != PrimitiveType.intType) {
                        throw SplError.NoSuchOperator(binaryExp.position, binaryExp.operator, first, second);
                    }
                    return binaryExp.dataType = PrimitiveType.boolType;
                }
            }
            case UnaryExpression unaryExp -> {
                Type unaryType = setTypes(unaryExp.operand, sb);
                if(unaryType == PrimitiveType.boolType)
                    throw SplError.NoSuchOperator(unaryExp.position, unaryExp.operator, unaryType);

                return unaryExp.dataType = unaryType;
            }
            case IntLiteral intLit -> {
                return intLit.dataType = PrimitiveType.intType;
            }
            case VariableExpression variableExp -> {
                switch (variableExp.variable) {
                    case NamedVariable namedVariable -> {
                        Entry entry = sb.lookup(namedVariable.name);
                        if(Objects.isNull(entry)) {
                            throw SplError.UndefinedVariable(variableExp.position, namedVariable.name);
                        }

                        switch(entry) {
                            case VariableEntry variableEntry -> {
                                return variableExp.dataType = variableEntry.type;
                            }
                            default -> { throw SplError.NotAVariable(variableExp.position, namedVariable.name); }
                        }
                    }
                    case ArrayAccess arrayAccess -> {
                        isArray(arrayAccess, sb, 1);
                        return arrayAccess.dataType = setTypes(arrayAccess.index, sb);
                    }
                }
            }
        }
        return null;
    }
}
