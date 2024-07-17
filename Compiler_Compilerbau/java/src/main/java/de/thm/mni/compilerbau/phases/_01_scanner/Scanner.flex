package de.thm.mni.compilerbau.phases._01_scanner;

import de.thm.mni.compilerbau.utils.SplError;
import de.thm.mni.compilerbau.phases._02_03_parser.Sym;
import de.thm.mni.compilerbau.absyn.Position;
import de.thm.mni.compilerbau.table.Identifier;
import de.thm.mni.compilerbau.CommandLineOptions;
import java_cup.runtime.*;

%%


%class Scanner
%public
%line
%column
%cup
%eofval{
    return new java_cup.runtime.Symbol(Sym.EOF, yyline + 1, yycolumn + 1);   //This needs to be specified when using a custom sym class name
%eofval}

%{
    public CommandLineOptions options = null;
  
    private Symbol symbol(int type) {
      return new Symbol(type, yyline + 1, yycolumn + 1);
    }

    private Symbol symbol(int type, Object value) {
      return new Symbol(type, yyline + 1, yycolumn + 1, value);
    }
%}

%%
        type     { return new Symbol(Sym.TYPE, yyline + 1, yycolumn + 1);  }
        proc     { return new Symbol(Sym.PROC, yyline + 1, yycolumn + 1);  }
        array    { return new Symbol(Sym.ARRAY, yyline + 1, yycolumn + 1); }
        of       { return new Symbol(Sym.OF, yyline + 1, yycolumn + 1);    }
        ref      { return new Symbol(Sym.REF, yyline + 1, yycolumn + 1);   }
        var      { return new Symbol(Sym.VAR, yyline + 1, yycolumn + 1);   }
        if       { return new Symbol(Sym.IF, yyline + 1, yycolumn + 1);    }
        else     { return new Symbol(Sym.ELSE, yyline + 1, yycolumn + 1);  }
        while    { return new Symbol(Sym.WHILE, yyline + 1, yycolumn + 1); }
        \[        { return new Symbol(Sym.LBRACK, yyline + 1, yycolumn + 1); }
        \]        { return new Symbol(Sym.RBRACK, yyline + 1, yycolumn + 1); }
        \(        { return new Symbol(Sym.LPAREN, yyline + 1, yycolumn + 1); }
        \)        { return new Symbol(Sym.RPAREN, yyline + 1, yycolumn + 1); }
        \{        { return new Symbol(Sym.LCURL, yyline + 1, yycolumn + 1);  }
        \}        { return new Symbol(Sym.RCURL, yyline + 1, yycolumn + 1);  }
        \+        { return new Symbol(Sym.PLUS, yyline + 1, yycolumn + 1);  }
        \-        { return new Symbol(Sym.MINUS, yyline + 1, yycolumn + 1); }
        \*        { return new Symbol(Sym.STAR, yyline + 1, yycolumn + 1);  }
        \/        { return new Symbol(Sym.SLASH, yyline + 1, yycolumn + 1); }
        \<        { return new Symbol(Sym.LT, yyline + 1, yycolumn + 1); }
        \<=       { return new Symbol(Sym.LE, yyline + 1, yycolumn + 1); }
        \>        { return new Symbol(Sym.GT, yyline + 1, yycolumn + 1); }
        \>=       { return new Symbol(Sym.GE, yyline + 1, yycolumn + 1); }
        \#        { return new Symbol(Sym.NE, yyline + 1, yycolumn + 1); }
        \=        { return new Symbol(Sym.EQ, yyline + 1, yycolumn + 1); }
        \:=       { return new Symbol(Sym.ASGN, yyline + 1, yycolumn + 1);  }
        \,        { return new Symbol(Sym.COMMA, yyline + 1, yycolumn + 1); }
        \:        { return new Symbol(Sym.COLON, yyline + 1, yycolumn + 1); }
        \;        { return new Symbol(Sym.SEMIC, yyline + 1, yycolumn + 1); }
        \/\/.*$  {/* Kommentare werden ignoriert */}
        [a-zA-Z_][a-zA-Z_0-9]*  { return new Symbol(Sym.IDENT, yyline + 1, yycolumn + 1, new Identifier(yytext()));}
        [0-9]+                  { return new Symbol(Sym.INTLIT, yyline + 1, yycolumn + 1, Integer.valueOf(yytext()));}
        '.{1}'                  { return new Symbol(Sym.INTLIT, yyline + 1, yycolumn + 1, Integer.valueOf(yytext().charAt(1)));}
        '\\n'                   { return new Symbol(Sym.INTLIT, yyline + 1, yycolumn + 1,  Integer.valueOf('\n'));}
        0x[a-fA-F0-9]+       { return new Symbol(Sym.INTLIT, yyline + 1, yycolumn + 1, Integer.decode(yytext()));}
        [\n |\r|\r\n|\t]        { /* für SPACE, TAB und NEWLINE ist nichts zu tun */ }
        [^]                     {throw SplError.IllegalCharacter(new Position(yyline + 1, yycolumn + 1), yytext().charAt(0));}

