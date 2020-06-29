/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cifradootp;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Scanner;

/**
 *
 * @author jnfco
 */
public class CifradoOTP {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here

        System.out.println("Ingrese el texto a cifrar: ");
        Scanner sc = new Scanner(System.in);
        String texto = sc.nextLine();
        System.out.println("Su valor ascii es; "+ convertASCII(texto));

    }

    public static int convertASCII(String texto) {

        if(texto == "a"){
            return 97;
        }
        if(texto == "b"){
            return 98;
        }
        if(texto == "c"){
            return 99;
        }
        if(texto == "d"){
            return 100;
        }
        if(texto == "e"){
            return 101;
        }
        if(texto == "f"){
            return 102;
        }
        if(texto == "g"){
            return 103;
        }
        if(texto == "h"){
            return 104;
        }
        if(texto == "i"){
            return 105;
        }
        if(texto == "j"){
            return 106;
        }
        if(texto == "k"){
            return 107;
        }
        if(texto == "l"){
            return 108;
        }
        if(texto == "m"){
            return 109;
        }
        if(texto == "n"){
            return 110;
        }
        if(texto == "ñ"){
            return 164;
        }
        if(texto == "o"){
            return 111;
        }
        if(texto == "p"){
            return 112;
        }
        if(texto == "q"){
            return 113;
        }
        if(texto == "r"){
            return 114;
        }
        if(texto == "s"){
            return 115;
        }
        if(texto == "t"){
            return 116;
        }
        if(texto == "u"){
            return 117;
        }
        if(texto == "v"){
            return 118;
        }
        if(texto == "w"){
            return 119;
        }
        if(texto == "x"){
            return 120;
        }
        if(texto == "y"){
            return 121;
        }

        if(texto == "z"){
            return 122;
        }

        //MAyusculas

        if(texto == "A"){
            return 65;
        }
        if(texto == "B"){
            return 66;
        }
        if(texto == "C"){
            return 67;
        }
        if(texto == "D"){
            return 68;
        }
        if(texto == "E"){
            return 69;
        }
        if(texto =="F"){
            return 70;
        }
        if(texto == "G"){
            return 71;
        }
        if(texto == "H"){
            return 72;
        }
        if(texto == "I"){
            return 73;
        }
        if(texto == "J"){
            return 74;
        }
        if(texto == "K"){
            return 75;
        }
        if(texto == "L"){
            return 76;
        }
        if(texto == "M"){
            return 77;
        }
        if(texto == "N"){
            return 78;
        }
        if(texto == "Ñ"){
            return 165;
        }
        if(texto == "O"){
            return 79;
        }
        if(texto == "P"){
            return 80;
        }
        if(texto == "Q"){
            return 81;
        }
        if(texto == "R"){
            return 82;
        }
        if(texto == "S"){
            return 83;
        }
        if(texto == "T"){
            return 84;
        }
        if(texto == "U"){
            return 85 ;
        }
        if(texto == "V"){
            return 86;
        }
        if(texto == "W"){
            return 87;
        }
        if(texto == "X"){
            return 88;
        }
        if(texto == "Y"){
            return 89;
        }
        if(texto == "Z"){

        }
      return 0;
    }

    public static void convertASCIIBinario(String ascii){

    }
}
