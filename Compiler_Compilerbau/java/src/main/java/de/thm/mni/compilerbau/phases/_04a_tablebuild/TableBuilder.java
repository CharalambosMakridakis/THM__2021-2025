package de.thm.mni.compilerbau.phases._04a_tablebuild;

import de.thm.mni.compilerbau.CommandLineOptions;
import de.thm.mni.compilerbau.absyn.*;
import de.thm.mni.compilerbau.phases._02_03_parser.Sym;
import de.thm.mni.compilerbau.table.*;
import de.thm.mni.compilerbau.types.ArrayType;
import de.thm.mni.compilerbau.types.PrimitiveType;
import de.thm.mni.compilerbau.types.Type;
import de.thm.mni.compilerbau.utils.NotImplemented;
import de.thm.mni.compilerbau.utils.SplError;

import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.Objects;
import java.util.List;

/**
 * This class is used to create and populate a {@link SymbolTable} containing entries for every symbol in the currently
 * compiled SPL program.
 * Every declaration of the SPL program needs its corresponding entry in the {@link SymbolTable}.
 * <p>
 * Calculated {@link Type}s can be stored in and read from the dataType field of the {@link Expression},
 * {@link TypeExpression} or {@link Variable} classes.
 */
public class TableBuilder { // DO NOT TOUCH A WORKING CODE
    private final CommandLineOptions options;

    public TableBuilder(CommandLineOptions options) {
        this.options = options;
    }

    public SymbolTable buildSymbolTable(Program program) {

        SymbolTable global = TableInitializer.initializeGlobalTable(options);
        program.declarations.forEach((x) -> processNode(x, global));
        return global;
    }

    public void processNode(Node start, SymbolTable table){

        switch (start) {
            case ProcedureDeclaration procDef -> {
                SymbolTable local = new SymbolTable(table);

                procDef.variables.forEach((x) -> processNode(x,local));

                List<ParameterType> paramTypeList = new ArrayList<>();
                for (ParameterDeclaration param : procDef.parameters) {

                    switch (param.typeExpression) {
                        case ArrayTypeExpression arrayType -> {
                            if(param.isReference) {
                                paramTypeList.add(new ParameterType(processArrayType(arrayType, table), true));
                            } else {
                                throw SplError.MustBeAReferenceParameter(arrayType.position, param.name);
                            }
                        }
                        case NamedTypeExpression namedType -> {

                            Entry entry = table.lookup(namedType.name);
                            if (Objects.isNull(entry)) {
                                throw SplError.UndefinedType(namedType.position, namedType.name);
                            }

                            switch (entry) {
                                case TypeEntry typeEntry -> {

                                    switch (typeEntry.type) {
                                        case ArrayType aT -> {
                                            if (!param.isReference) {
                                                throw SplError.MustBeAReferenceParameter(param.position, param.name);
                                            }
                                        }
                                        case default -> {}
                                    }

                                    paramTypeList.add(new ParameterType(typeEntry.type, param.isReference));
                                    local.enter(param.name, new VariableEntry(typeEntry.type, param.isReference), SplError.RedeclarationAsParameter(namedType.position, param.name));
                                }
                                default -> {throw SplError.NotAType(namedType.position, namedType.name);}
                            }

                        }
                        default -> {}
                    }
                }


                ProcedureEntry procEntry = new ProcedureEntry(local, paramTypeList);
                table.enter(procDef.name, procEntry, SplError.RedeclarationAsProcedure(procDef.position, procDef.name));
                printSymbolTableAtEndOfProcedure(procDef.name, procEntry);
            }
            case TypeDeclaration typeDef -> {

                switch (typeDef.typeExpression) {
                    case ArrayTypeExpression arrayType -> {
                        table.enter(typeDef.name, new TypeEntry(processArrayType(arrayType, table)), SplError.RedeclarationAsType(arrayType.position, typeDef.name));
                    }
                    case NamedTypeExpression namedType -> {

                        Entry entry = table.lookup(namedType.name);
                        if (Objects.isNull(entry)) {
                            throw SplError.UndefinedType(namedType.position, namedType.name);
                        }

                        switch (entry) {
                            case TypeEntry typeEntry -> {
                                table.enter(typeDef.name, typeEntry, SplError.RedeclarationAsType(namedType.position, typeDef.name));
                            }
                            default -> {throw SplError.NotAType(namedType.position, namedType.name);}
                        }

                    }
                    default -> {
                        System.out.println("Fehler: processNode() - TypeDec");
                    }
                }

            }
            case VariableDeclaration varDef -> {

                switch (varDef.typeExpression) {
                    case ArrayTypeExpression arrayType -> {
                        table.enter(varDef.name, new VariableEntry(processArrayType(arrayType, table), false), SplError.RedeclarationAsVariable(arrayType.position, varDef.name));
                    }
                    case NamedTypeExpression namedType -> {

                        Entry entry = table.lookup(namedType.name);
                        if (Objects.isNull(entry)) {
                            throw SplError.UndefinedType(namedType.position, namedType.name);
                        }

                        switch (entry) {
                            case TypeEntry typeEntry -> {
                                table.enter(varDef.name, new VariableEntry(typeEntry.type, false), SplError.RedeclarationAsVariable(namedType.position, varDef.name));
                            }
                            default -> {throw SplError.NotAType(namedType.position, namedType.name);}
                        }
                    }
                    default -> {
                        System.out.println("Fehler: processNode() - Variables");
                    }
                }

            }
            default -> System.out.println("nicht erkannt");
        }

    }

    public ArrayType processArrayType(TypeExpression typeExpression, SymbolTable table) {
        ArrayTypeExpression arrayTypeExpression = (ArrayTypeExpression) typeExpression;
        switch (arrayTypeExpression.baseType) {
            case ArrayTypeExpression array -> {
                return new ArrayType(processArrayType(arrayTypeExpression.baseType, table), arrayTypeExpression.arraySize);
            }
            case NamedTypeExpression namedType -> {

                Entry entry = table.lookup(namedType.name);
                if (Objects.isNull(entry)) {
                    throw SplError.UndefinedType(namedType.position, namedType.name);
                }

                switch (entry) {
                    case TypeEntry typeEntry -> {
                        return new ArrayType(typeEntry.type, arrayTypeExpression.arraySize);
                    }
                    default -> {throw SplError.NotAType(namedType.position, namedType.name);}
                }

            }
        }
        return null;
    }

    /**
     * Prints the local symbol table of a procedure together with a heading-line
     * NOTE: You have to call this after completing the local table to support '--tables'.
     *
     * @param name  The name of the procedure
     * @param entry The entry of the procedure to print
     */
    static void printSymbolTableAtEndOfProcedure(Identifier name, ProcedureEntry entry) {
        System.out.format("Symbol table at end of procedure '%s':\n", name);
        System.out.println(entry.localTable.toString());
    }
}
