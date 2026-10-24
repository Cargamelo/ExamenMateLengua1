"use strict";
/* Preguntas originales derivadas de competencias verificadas en Google Drive.
   No se reproducen PDFs, fotografías, personas ni enunciados completos originales. */
(function(){
 const questions=[
 {
  "id": "DRIVE-MATH-LECT-01",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «seis mil doscientos siete»?",
  "correct": "6207",
  "visual": "",
  "choices": [
   "6207",
   "6217",
   "6307",
   "6107"
  ],
  "explanation": "Separamos los millares y las cifras restantes: seis mil doscientos siete es 6207.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 6207
  }
 },
 {
  "id": "DRIVE-MATH-LECT-02",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «nueve mil ocho»?",
  "correct": "9008",
  "visual": "",
  "choices": [
   "9008",
   "9018",
   "9108",
   "8908"
  ],
  "explanation": "Separamos los millares y las cifras restantes: nueve mil ocho es 9008.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 9008
  }
 },
 {
  "id": "DRIVE-MATH-LECT-03",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «dos mil cuatrocientos ochenta y dos»?",
  "correct": "2482",
  "visual": "",
  "choices": [
   "2482",
   "2492",
   "2582",
   "2382"
  ],
  "explanation": "Separamos los millares y las cifras restantes: dos mil cuatrocientos ochenta y dos es 2482.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 2482
  }
 },
 {
  "id": "DRIVE-MATH-LECT-04",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «siete mil noventa y cinco»?",
  "correct": "7095",
  "visual": "",
  "choices": [
   "7095",
   "7105",
   "7195",
   "6995"
  ],
  "explanation": "Separamos los millares y las cifras restantes: siete mil noventa y cinco es 7095.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 7095
  }
 },
 {
  "id": "DRIVE-MATH-LECT-05",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «cuatro mil quinientos»?",
  "correct": "4500",
  "visual": "",
  "choices": [
   "4500",
   "4510",
   "4600",
   "4400"
  ],
  "explanation": "Separamos los millares y las cifras restantes: cuatro mil quinientos es 4500.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 4500
  }
 },
 {
  "id": "DRIVE-MATH-LECT-06",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «siete mil novecientos ocho»?",
  "correct": "7908",
  "visual": "",
  "choices": [
   "7908",
   "7918",
   "8008",
   "7808"
  ],
  "explanation": "Separamos los millares y las cifras restantes: siete mil novecientos ocho es 7908.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 7908
  }
 },
 {
  "id": "DRIVE-MATH-LECT-07",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «nueve mil cuarenta»?",
  "correct": "9040",
  "visual": "",
  "choices": [
   "9040",
   "9050",
   "9140",
   "8940"
  ],
  "explanation": "Separamos los millares y las cifras restantes: nueve mil cuarenta es 9040.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 9040
  }
 },
 {
  "id": "DRIVE-MATH-LECT-08",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Qué número corresponde a «ocho mil doscientos dos»?",
  "correct": "8202",
  "visual": "",
  "choices": [
   "8202",
   "8212",
   "8302",
   "8102"
  ],
  "explanation": "Separamos los millares y las cifras restantes: ocho mil doscientos dos es 8202.",
  "hint1": "Escucha la cantidad de millares.",
  "hint2": "Comprueba si hay centenas o decenas que valen cero.",
  "numeric": false,
  "source": "MAT-LECTURA-2",
  "check": {
   "kind": "number",
   "value": 8202
  }
 },
 {
  "id": "DRIVE-MATH-VEC-01",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número anterior a 8999?",
  "correct": "8998",
  "visual": "",
  "choices": [
   "8998",
   "8999",
   "9000",
   "8997"
  ],
  "explanation": "Para hallar el anterior, restamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "prev",
   "value": 8999
  }
 },
 {
  "id": "DRIVE-MATH-VEC-02",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número posterior a 1569?",
  "correct": "1570",
  "visual": "",
  "choices": [
   "1570",
   "1569",
   "1568",
   "1571"
  ],
  "explanation": "Para hallar el posterior, sumamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "next",
   "value": 1569
  }
 },
 {
  "id": "DRIVE-MATH-VEC-03",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número anterior a 1000?",
  "correct": "999",
  "visual": "",
  "choices": [
   "999",
   "1000",
   "1001",
   "998"
  ],
  "explanation": "Para hallar el anterior, restamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "prev",
   "value": 1000
  }
 },
 {
  "id": "DRIVE-MATH-VEC-04",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número posterior a 5835?",
  "correct": "5836",
  "visual": "",
  "choices": [
   "5836",
   "5835",
   "5834",
   "5837"
  ],
  "explanation": "Para hallar el posterior, sumamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "next",
   "value": 5835
  }
 },
 {
  "id": "DRIVE-MATH-VEC-05",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número anterior a 3478?",
  "correct": "3477",
  "visual": "",
  "choices": [
   "3477",
   "3478",
   "3479",
   "3476"
  ],
  "explanation": "Para hallar el anterior, restamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "prev",
   "value": 3478
  }
 },
 {
  "id": "DRIVE-MATH-VEC-06",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número posterior a 5300?",
  "correct": "5301",
  "visual": "",
  "choices": [
   "5301",
   "5300",
   "5299",
   "5302"
  ],
  "explanation": "Para hallar el posterior, sumamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "next",
   "value": 5300
  }
 },
 {
  "id": "DRIVE-MATH-VEC-07",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número anterior a 1734?",
  "correct": "1733",
  "visual": "",
  "choices": [
   "1733",
   "1734",
   "1735",
   "1732"
  ],
  "explanation": "Para hallar el anterior, restamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-COMPARACION-4",
  "check": {
   "kind": "prev",
   "value": 1734
  }
 },
 {
  "id": "DRIVE-MATH-VEC-08",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número posterior a 8345?",
  "correct": "8346",
  "visual": "",
  "choices": [
   "8346",
   "8345",
   "8344",
   "8347"
  ],
  "explanation": "Para hallar el posterior, sumamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-COMPARACION-4",
  "check": {
   "kind": "next",
   "value": 8345
  }
 },
 {
  "id": "DRIVE-MATH-VEC-09",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número anterior a 9056?",
  "correct": "9055",
  "visual": "",
  "choices": [
   "9055",
   "9056",
   "9057",
   "9054"
  ],
  "explanation": "Para hallar el anterior, restamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-COMPARACION-4",
  "check": {
   "kind": "prev",
   "value": 9056
  }
 },
 {
  "id": "DRIVE-MATH-VEC-10",
  "subject": "math",
  "topic": "numeros",
  "variant": "drive",
  "prompt": "¿Cuál es el número posterior a 3999?",
  "correct": "4000",
  "visual": "",
  "choices": [
   "4000",
   "3999",
   "3998",
   "4001"
  ],
  "explanation": "Para hallar el posterior, sumamos 1.",
  "hint1": "Piensa en los números que están justo al lado.",
  "hint2": "Cuidado cuando cambia un millar o una centena.",
  "numeric": false,
  "source": "MAT-COMPARACION-4",
  "check": {
   "kind": "next",
   "value": 3999
  }
 },
 {
  "id": "DRIVE-MATH-DES-01",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "¿Qué descomposición representa 765?",
  "correct": "700 + 60 + 5",
  "visual": "",
  "choices": [
   "700 + 60 + 5",
   "800 + 60 + 5",
   "700 + 50 + 5",
   "700 + 60 + 6"
  ],
  "explanation": "Cada cifra expresa su valor según su posición: 765 = 700 + 60 + 5.",
  "hint1": "Separa unidades de millar, centenas, decenas y unidades.",
  "hint2": "Las columnas cuyo dígito sea cero no necesitan sumarse.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "decomposition",
   "value": 765
  }
 },
 {
  "id": "DRIVE-MATH-DES-02",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "¿Qué descomposición representa 9356?",
  "correct": "9000 + 300 + 50 + 6",
  "visual": "",
  "choices": [
   "9000 + 300 + 50 + 6",
   "9000 + 400 + 50 + 6",
   "9000 + 300 + 40 + 6",
   "9000 + 300 + 50 + 7"
  ],
  "explanation": "Cada cifra expresa su valor según su posición: 9356 = 9000 + 300 + 50 + 6.",
  "hint1": "Separa unidades de millar, centenas, decenas y unidades.",
  "hint2": "Las columnas cuyo dígito sea cero no necesitan sumarse.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "decomposition",
   "value": 9356
  }
 },
 {
  "id": "DRIVE-MATH-DES-03",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "¿Qué descomposición representa 8064?",
  "correct": "8000 + 60 + 4",
  "visual": "",
  "choices": [
   "8000 + 60 + 4",
   "8000 + 100 + 60 + 4",
   "8000 + 50 + 4",
   "8000 + 60 + 5"
  ],
  "explanation": "Cada cifra expresa su valor según su posición: 8064 = 8000 + 60 + 4.",
  "hint1": "Separa unidades de millar, centenas, decenas y unidades.",
  "hint2": "Las columnas cuyo dígito sea cero no necesitan sumarse.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "decomposition",
   "value": 8064
  }
 },
 {
  "id": "DRIVE-MATH-DES-04",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "¿Qué descomposición representa 685?",
  "correct": "600 + 80 + 5",
  "visual": "",
  "choices": [
   "600 + 80 + 5",
   "700 + 80 + 5",
   "600 + 70 + 5",
   "600 + 80 + 6"
  ],
  "explanation": "Cada cifra expresa su valor según su posición: 685 = 600 + 80 + 5.",
  "hint1": "Separa unidades de millar, centenas, decenas y unidades.",
  "hint2": "Las columnas cuyo dígito sea cero no necesitan sumarse.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "decomposition",
   "value": 685
  }
 },
 {
  "id": "DRIVE-MATH-DES-05",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "¿Qué descomposición representa 7040?",
  "correct": "7000 + 40",
  "visual": "",
  "choices": [
   "7000 + 40",
   "7000 + 100 + 40",
   "7000 + 30",
   "7000 + 40 + 1"
  ],
  "explanation": "Cada cifra expresa su valor según su posición: 7040 = 7000 + 40.",
  "hint1": "Separa unidades de millar, centenas, decenas y unidades.",
  "hint2": "Las columnas cuyo dígito sea cero no necesitan sumarse.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "decomposition",
   "value": 7040
  }
 },
 {
  "id": "DRIVE-MATH-DES-06",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "¿Qué descomposición representa 289?",
  "correct": "200 + 80 + 9",
  "visual": "",
  "choices": [
   "200 + 80 + 9",
   "300 + 80 + 9",
   "200 + 70 + 9",
   "200 + 90"
  ],
  "explanation": "Cada cifra expresa su valor según su posición: 289 = 200 + 80 + 9.",
  "hint1": "Separa unidades de millar, centenas, decenas y unidades.",
  "hint2": "Las columnas cuyo dígito sea cero no necesitan sumarse.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "decomposition",
   "value": 289
  }
 },
 {
  "id": "DRIVE-MATH-POS-01",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "En 9326, ¿qué cifra ocupa la columna de las unidades de millar?",
  "correct": "9",
  "visual": "",
  "choices": [
   "9",
   "0",
   "1",
   "8"
  ],
  "explanation": "La cifra de esa columna es 9.",
  "hint1": "Empieza por la derecha: unidades, decenas, centenas, millares.",
  "hint2": "Una columna vacía se representa con la cifra 0.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "digit",
   "value": 9326,
   "place": 1000
  }
 },
 {
  "id": "DRIVE-MATH-POS-02",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "En 7040, ¿qué cifra ocupa la columna de las centenas?",
  "correct": "0",
  "visual": "",
  "choices": [
   "0",
   "1",
   "2",
   "9"
  ],
  "explanation": "La cifra de esa columna es 0.",
  "hint1": "Empieza por la derecha: unidades, decenas, centenas, millares.",
  "hint2": "Una columna vacía se representa con la cifra 0.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "digit",
   "value": 7040,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-POS-03",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "En 7040, ¿qué cifra ocupa la columna de las decenas?",
  "correct": "4",
  "visual": "",
  "choices": [
   "4",
   "5",
   "6",
   "3"
  ],
  "explanation": "La cifra de esa columna es 4.",
  "hint1": "Empieza por la derecha: unidades, decenas, centenas, millares.",
  "hint2": "Una columna vacía se representa con la cifra 0.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "digit",
   "value": 7040,
   "place": 10
  }
 },
 {
  "id": "DRIVE-MATH-POS-04",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "En 685, ¿qué cifra ocupa la columna de las centenas?",
  "correct": "6",
  "visual": "",
  "choices": [
   "6",
   "7",
   "8",
   "5"
  ],
  "explanation": "La cifra de esa columna es 6.",
  "hint1": "Empieza por la derecha: unidades, decenas, centenas, millares.",
  "hint2": "Una columna vacía se representa con la cifra 0.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "digit",
   "value": 685,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-POS-05",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "En 8064, ¿qué cifra ocupa la columna de las centenas?",
  "correct": "0",
  "visual": "",
  "choices": [
   "0",
   "1",
   "2",
   "9"
  ],
  "explanation": "La cifra de esa columna es 0.",
  "hint1": "Empieza por la derecha: unidades, decenas, centenas, millares.",
  "hint2": "Una columna vacía se representa con la cifra 0.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "digit",
   "value": 8064,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-POS-06",
  "subject": "math",
  "topic": "descomponer",
  "variant": "drive",
  "prompt": "En 289, ¿qué cifra ocupa la columna de las unidades?",
  "correct": "9",
  "visual": "",
  "choices": [
   "9",
   "0",
   "1",
   "8"
  ],
  "explanation": "La cifra de esa columna es 9.",
  "hint1": "Empieza por la derecha: unidades, decenas, centenas, millares.",
  "hint2": "Una columna vacía se representa con la cifra 0.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "digit",
   "value": 289,
   "place": 1
  }
 },
 {
  "id": "DRIVE-MATH-CMP-01",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 3482 __ 3428",
  "correct": ">",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "3482 es mayor que 3428.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 3482,
   "b": 3428
  }
 },
 {
  "id": "DRIVE-MATH-CMP-02",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 2706 __ 2760",
  "correct": "<",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "2706 es menor que 2760.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 2706,
   "b": 2760
  }
 },
 {
  "id": "DRIVE-MATH-CMP-03",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 6315 __ 6351",
  "correct": "<",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "6315 es menor que 6351.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 6315,
   "b": 6351
  }
 },
 {
  "id": "DRIVE-MATH-CMP-04",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 4099 __ 4100",
  "correct": "<",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "4099 es menor que 4100.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 4099,
   "b": 4100
  }
 },
 {
  "id": "DRIVE-MATH-CMP-05",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 8245 __ 8245",
  "correct": "=",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "8245 es igual a 8245.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 8245,
   "b": 8245
  }
 },
 {
  "id": "DRIVE-MATH-CMP-06",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 5678 __ 5687",
  "correct": "<",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "5678 es menor que 5687.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 5678,
   "b": 5687
  }
 },
 {
  "id": "DRIVE-MATH-CMP-07",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 1999 __ 2000",
  "correct": "<",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "1999 es menor que 2000.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 1999,
   "b": 2000
  }
 },
 {
  "id": "DRIVE-MATH-CMP-08",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 7405 __ 7045",
  "correct": ">",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "7405 es mayor que 7045.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 7405,
   "b": 7045
  }
 },
 {
  "id": "DRIVE-MATH-CMP-09",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 4567 __ 4576",
  "correct": "<",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "4567 es menor que 4576.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 4567,
   "b": 4576
  }
 },
 {
  "id": "DRIVE-MATH-CMP-10",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 3090 __ 3009",
  "correct": ">",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "3090 es mayor que 3009.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 3090,
   "b": 3009
  }
 },
 {
  "id": "DRIVE-MATH-CMP-11",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 9100 __ 8999",
  "correct": ">",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "9100 es mayor que 8999.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "compare",
   "a": 9100,
   "b": 8999
  }
 },
 {
  "id": "DRIVE-MATH-CMP-12",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 7825 __ 7815",
  "correct": ">",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "7825 es mayor que 7815.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-COMPARACION-2",
  "check": {
   "kind": "compare",
   "a": 7825,
   "b": 7815
  }
 },
 {
  "id": "DRIVE-MATH-CMP-13",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Elige el signo correcto para 8001 __ 8001",
  "correct": "=",
  "visual": "",
  "choices": [
   "<",
   "=",
   ">"
  ],
  "explanation": "8001 es igual a 8001.",
  "hint1": "Empieza comparando las unidades de millar.",
  "hint2": "Si son iguales, compara centenas, luego decenas y unidades.",
  "numeric": false,
  "source": "MAT-COMPARACION-2",
  "check": {
   "kind": "compare",
   "a": 8001,
   "b": 8001
  }
 },
 {
  "id": "DRIVE-MATH-ORD-01",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Ordena de menor a mayor estos cuatro números: 4125 · 4215 · 4052 · 4251",
  "correct": "4052 → 4125 → 4215 → 4251",
  "visual": "",
  "choices": [
   "4052 → 4125 → 4215 → 4251",
   "4251 → 4215 → 4125 → 4052",
   "4125 → 4052 → 4215 → 4251",
   "4052 → 4215 → 4125 → 4251"
  ],
  "explanation": "Comparamos primero los millares y después las demás cifras.",
  "hint1": "Localiza el menor y colócalo al principio.",
  "hint2": "Repite hasta situar el mayor al final.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "sort",
   "values": [
    4125,
    4215,
    4052,
    4251
   ]
  }
 },
 {
  "id": "DRIVE-MATH-ORD-02",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Ordena de menor a mayor estos cuatro números: 6780 · 6708 · 6087 · 6870",
  "correct": "6087 → 6708 → 6780 → 6870",
  "visual": "",
  "choices": [
   "6087 → 6708 → 6780 → 6870",
   "6870 → 6780 → 6708 → 6087",
   "6708 → 6087 → 6780 → 6870",
   "6087 → 6780 → 6708 → 6870"
  ],
  "explanation": "Comparamos primero los millares y después las demás cifras.",
  "hint1": "Localiza el menor y colócalo al principio.",
  "hint2": "Repite hasta situar el mayor al final.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "sort",
   "values": [
    6780,
    6708,
    6087,
    6870
   ]
  }
 },
 {
  "id": "DRIVE-MATH-ORD-03",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Ordena de menor a mayor estos cuatro números: 2345 · 2543 · 2354 · 2435",
  "correct": "2345 → 2354 → 2435 → 2543",
  "visual": "",
  "choices": [
   "2345 → 2354 → 2435 → 2543",
   "2543 → 2435 → 2354 → 2345",
   "2354 → 2345 → 2435 → 2543",
   "2345 → 2435 → 2354 → 2543"
  ],
  "explanation": "Comparamos primero los millares y después las demás cifras.",
  "hint1": "Localiza el menor y colócalo al principio.",
  "hint2": "Repite hasta situar el mayor al final.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "sort",
   "values": [
    2345,
    2543,
    2354,
    2435
   ]
  }
 },
 {
  "id": "DRIVE-MATH-ORD-04",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Ordena de menor a mayor estos cuatro números: 7040 · 7400 · 7004 · 7440",
  "correct": "7004 → 7040 → 7400 → 7440",
  "visual": "",
  "choices": [
   "7004 → 7040 → 7400 → 7440",
   "7440 → 7400 → 7040 → 7004",
   "7040 → 7004 → 7400 → 7440",
   "7004 → 7400 → 7040 → 7440"
  ],
  "explanation": "Comparamos primero los millares y después las demás cifras.",
  "hint1": "Localiza el menor y colócalo al principio.",
  "hint2": "Repite hasta situar el mayor al final.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "sort",
   "values": [
    7040,
    7400,
    7004,
    7440
   ]
  }
 },
 {
  "id": "DRIVE-MATH-APR-01-10",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 3618 a la decena más cercana.",
  "correct": "3620",
  "visual": "",
  "choices": [
   "3620",
   "3630",
   "3610",
   "3618"
  ],
  "explanation": "Al redondear a la decena, obtenemos 3620.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 3618,
   "place": 10
  }
 },
 {
  "id": "DRIVE-MATH-APR-01-100",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 3618 a la centena más cercana.",
  "correct": "3600",
  "visual": "",
  "choices": [
   "3600",
   "3700",
   "3500",
   "3618"
  ],
  "explanation": "Al redondear a la centena, obtenemos 3600.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 3618,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-APR-01-1000",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 3618 a la unidad de millar más cercana.",
  "correct": "4000",
  "visual": "",
  "choices": [
   "4000",
   "5000",
   "3000",
   "3618"
  ],
  "explanation": "Al redondear a la unidad de millar, obtenemos 4000.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 3618,
   "place": 1000
  }
 },
 {
  "id": "DRIVE-MATH-APR-02-10",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 7425 a la decena más cercana.",
  "correct": "7430",
  "visual": "",
  "choices": [
   "7430",
   "7440",
   "7420",
   "7425"
  ],
  "explanation": "Al redondear a la decena, obtenemos 7430.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 7425,
   "place": 10
  }
 },
 {
  "id": "DRIVE-MATH-APR-02-100",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 7425 a la centena más cercana.",
  "correct": "7400",
  "visual": "",
  "choices": [
   "7400",
   "7500",
   "7300",
   "7425"
  ],
  "explanation": "Al redondear a la centena, obtenemos 7400.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 7425,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-APR-02-1000",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 7425 a la unidad de millar más cercana.",
  "correct": "7000",
  "visual": "",
  "choices": [
   "7000",
   "8000",
   "6000",
   "7425"
  ],
  "explanation": "Al redondear a la unidad de millar, obtenemos 7000.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 7425,
   "place": 1000
  }
 },
 {
  "id": "DRIVE-MATH-APR-03-10",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 5863 a la decena más cercana.",
  "correct": "5860",
  "visual": "",
  "choices": [
   "5860",
   "5870",
   "5850",
   "5863"
  ],
  "explanation": "Al redondear a la decena, obtenemos 5860.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 5863,
   "place": 10
  }
 },
 {
  "id": "DRIVE-MATH-APR-03-100",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 5863 a la centena más cercana.",
  "correct": "5900",
  "visual": "",
  "choices": [
   "5900",
   "6000",
   "5800",
   "5863"
  ],
  "explanation": "Al redondear a la centena, obtenemos 5900.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 5863,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-APR-03-1000",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 5863 a la unidad de millar más cercana.",
  "correct": "6000",
  "visual": "",
  "choices": [
   "6000",
   "7000",
   "5000",
   "5863"
  ],
  "explanation": "Al redondear a la unidad de millar, obtenemos 6000.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 5863,
   "place": 1000
  }
 },
 {
  "id": "DRIVE-MATH-APR-04-10",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 2197 a la decena más cercana.",
  "correct": "2200",
  "visual": "",
  "choices": [
   "2200",
   "2210",
   "2190",
   "2197"
  ],
  "explanation": "Al redondear a la decena, obtenemos 2200.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 2197,
   "place": 10
  }
 },
 {
  "id": "DRIVE-MATH-APR-04-100",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 2197 a la centena más cercana.",
  "correct": "2200",
  "visual": "",
  "choices": [
   "2200",
   "2300",
   "2100",
   "2197"
  ],
  "explanation": "Al redondear a la centena, obtenemos 2200.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 2197,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-APR-04-1000",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 2197 a la unidad de millar más cercana.",
  "correct": "2000",
  "visual": "",
  "choices": [
   "2000",
   "3000",
   "1000",
   "2197"
  ],
  "explanation": "Al redondear a la unidad de millar, obtenemos 2000.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 2197,
   "place": 1000
  }
 },
 {
  "id": "DRIVE-MATH-APR-05-10",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 8042 a la decena más cercana.",
  "correct": "8040",
  "visual": "",
  "choices": [
   "8040",
   "8050",
   "8030",
   "8042"
  ],
  "explanation": "Al redondear a la decena, obtenemos 8040.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 8042,
   "place": 10
  }
 },
 {
  "id": "DRIVE-MATH-APR-05-100",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 8042 a la centena más cercana.",
  "correct": "8000",
  "visual": "",
  "choices": [
   "8000",
   "8100",
   "7900",
   "8042"
  ],
  "explanation": "Al redondear a la centena, obtenemos 8000.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 8042,
   "place": 100
  }
 },
 {
  "id": "DRIVE-MATH-APR-05-1000",
  "subject": "math",
  "topic": "comparar",
  "variant": "drive",
  "prompt": "Aproxima 8042 a la unidad de millar más cercana.",
  "correct": "8000",
  "visual": "",
  "choices": [
   "8000",
   "9000",
   "7000",
   "8042"
  ],
  "explanation": "Al redondear a la unidad de millar, obtenemos 8000.",
  "hint1": "Observa la cifra inmediatamente a la derecha de la posición elegida.",
  "hint2": "Con 5 o más se redondea hacia arriba.",
  "numeric": false,
  "source": "MAT-CONTROL-2",
  "check": {
   "kind": "round",
   "value": 8042,
   "place": 1000
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-09",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 9.º?",
  "correct": "noveno",
  "visual": "",
  "choices": [
   "noveno",
   "décimo",
   "duodécimo",
   "decimocuarto"
  ],
  "explanation": "El ordinal 9.º se lee «noveno».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 9
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-10",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 10.º?",
  "correct": "décimo",
  "visual": "",
  "choices": [
   "décimo",
   "undécimo",
   "decimotercero",
   "decimoquinto"
  ],
  "explanation": "El ordinal 10.º se lee «décimo».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 10
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-11",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 11.º?",
  "correct": "undécimo",
  "visual": "",
  "choices": [
   "undécimo",
   "duodécimo",
   "decimocuarto",
   "decimosexto"
  ],
  "explanation": "El ordinal 11.º se lee «undécimo».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 11
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-12",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 12.º?",
  "correct": "duodécimo",
  "visual": "",
  "choices": [
   "duodécimo",
   "decimotercero",
   "decimoquinto",
   "decimoséptimo"
  ],
  "explanation": "El ordinal 12.º se lee «duodécimo».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 12
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-13",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 13.º?",
  "correct": "decimotercero",
  "visual": "",
  "choices": [
   "decimotercero",
   "decimocuarto",
   "decimosexto",
   "decimoctavo"
  ],
  "explanation": "El ordinal 13.º se lee «decimotercero».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 13
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-14",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 14.º?",
  "correct": "decimocuarto",
  "visual": "",
  "choices": [
   "decimocuarto",
   "decimoquinto",
   "decimoséptimo",
   "decimonoveno"
  ],
  "explanation": "El ordinal 14.º se lee «decimocuarto».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 14
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-15",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 15.º?",
  "correct": "decimoquinto",
  "visual": "",
  "choices": [
   "decimoquinto",
   "decimosexto",
   "decimoctavo",
   "vigésimo"
  ],
  "explanation": "El ordinal 15.º se lee «decimoquinto».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 15
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-16",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 16.º?",
  "correct": "decimosexto",
  "visual": "",
  "choices": [
   "decimosexto",
   "decimoséptimo",
   "decimonoveno",
   "noveno"
  ],
  "explanation": "El ordinal 16.º se lee «decimosexto».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 16
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-17",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 17.º?",
  "correct": "decimoséptimo",
  "visual": "",
  "choices": [
   "decimoséptimo",
   "decimoctavo",
   "vigésimo",
   "décimo"
  ],
  "explanation": "El ordinal 17.º se lee «decimoséptimo».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 17
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-18",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 18.º?",
  "correct": "decimoctavo",
  "visual": "",
  "choices": [
   "decimoctavo",
   "decimonoveno",
   "noveno",
   "undécimo"
  ],
  "explanation": "El ordinal 18.º se lee «decimoctavo».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 18
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-19",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 19.º?",
  "correct": "decimonoveno",
  "visual": "",
  "choices": [
   "decimonoveno",
   "vigésimo",
   "décimo",
   "duodécimo"
  ],
  "explanation": "El ordinal 19.º se lee «decimonoveno».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 19
  }
 },
 {
  "id": "DRIVE-MATH-ORDI-20",
  "subject": "math",
  "topic": "ordinales",
  "variant": "drive",
  "prompt": "¿Cómo se lee el puesto 20.º?",
  "correct": "vigésimo",
  "visual": "",
  "choices": [
   "vigésimo",
   "noveno",
   "undécimo",
   "decimotercero"
  ],
  "explanation": "El ordinal 20.º se lee «vigésimo».",
  "hint1": "Los ordinales expresan la posición, no una cantidad.",
  "hint2": "Recuerda que los puestos a partir del décimo tienen nombres propios.",
  "numeric": false,
  "source": "MAT-CONTROL-1",
  "check": {
   "kind": "ordinal",
   "value": 20
  }
 },
 {
  "id": "DRIVE-MATH-CAL-01",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 135 + 247.",
  "correct": "382",
  "visual": "",
  "choices": [
   "382",
   "392",
   "372",
   "482"
  ],
  "explanation": "El resultado es 382. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "add",
   "a": 135,
   "b": 247
  }
 },
 {
  "id": "DRIVE-MATH-CAL-02",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 286 + 153.",
  "correct": "439",
  "visual": "",
  "choices": [
   "439",
   "449",
   "429",
   "539"
  ],
  "explanation": "El resultado es 439. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "add",
   "a": 286,
   "b": 153
  }
 },
 {
  "id": "DRIVE-MATH-CAL-03",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 194 + 562.",
  "correct": "756",
  "visual": "",
  "choices": [
   "756",
   "766",
   "746",
   "856"
  ],
  "explanation": "El resultado es 756. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "add",
   "a": 194,
   "b": 562
  }
 },
 {
  "id": "DRIVE-MATH-CAL-04",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 714 + 268.",
  "correct": "982",
  "visual": "",
  "choices": [
   "982",
   "992",
   "972",
   "1082"
  ],
  "explanation": "El resultado es 982. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "add",
   "a": 714,
   "b": 268
  }
 },
 {
  "id": "DRIVE-MATH-CAL-05",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 782 − 394.",
  "correct": "388",
  "visual": "",
  "choices": [
   "388",
   "398",
   "378",
   "488"
  ],
  "explanation": "El resultado es 388. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "subtract",
   "a": 782,
   "b": 394
  }
 },
 {
  "id": "DRIVE-MATH-CAL-06",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 900 − 457.",
  "correct": "443",
  "visual": "",
  "choices": [
   "443",
   "453",
   "433",
   "543"
  ],
  "explanation": "El resultado es 443. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "subtract",
   "a": 900,
   "b": 457
  }
 },
 {
  "id": "DRIVE-MATH-CAL-07",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 1034 − 296.",
  "correct": "738",
  "visual": "",
  "choices": [
   "738",
   "748",
   "728",
   "838"
  ],
  "explanation": "El resultado es 738. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "subtract",
   "a": 1034,
   "b": 296
  }
 },
 {
  "id": "DRIVE-MATH-CAL-08",
  "subject": "math",
  "topic": "operaciones",
  "variant": "drive",
  "prompt": "Calcula 805 − 378.",
  "correct": "427",
  "visual": "",
  "choices": [
   "427",
   "437",
   "417",
   "527"
  ],
  "explanation": "El resultado es 427. Opera por columnas desde las unidades.",
  "hint1": "Alinea unidades con unidades y decenas con decenas.",
  "hint2": "Si es necesario, lleva o reagrupa una columna.",
  "numeric": false,
  "source": "MAT-SUMAS-RESTAS",
  "check": {
   "kind": "subtract",
   "a": 805,
   "b": 378
  }
 },
 {
  "id": "DRIVE-LANG-SIN-01",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «automóvil»?",
  "correct": "coche",
  "visual": "",
  "choices": [
   "coche",
   "hermoso",
   "efectuar",
   "sosegado"
  ],
  "explanation": "«automóvil» y «coche» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "automóvil",
   "to": "coche",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-02",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «cabello»?",
  "correct": "pelo",
  "visual": "",
  "choices": [
   "pelo",
   "veloz",
   "sencillo",
   "contestar"
  ],
  "explanation": "«cabello» y «pelo» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "cabello",
   "to": "pelo",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-03",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «aula»?",
  "correct": "clase",
  "visual": "",
  "choices": [
   "clase",
   "efectuar",
   "sosegado",
   "complicado"
  ],
  "explanation": "«aula» y «clase» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "aula",
   "to": "clase",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-04",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «bonito»?",
  "correct": "hermoso",
  "visual": "",
  "choices": [
   "hermoso",
   "sencillo",
   "contestar",
   "obsequio"
  ],
  "explanation": "«bonito» y «hermoso» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "lexical",
   "from": "bonito",
   "to": "hermoso",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-05",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «rápido»?",
  "correct": "veloz",
  "visual": "",
  "choices": [
   "veloz",
   "sosegado",
   "complicado",
   "acabar"
  ],
  "explanation": "«rápido» y «veloz» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "lexical",
   "from": "rápido",
   "to": "veloz",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-06",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «realizar»?",
  "correct": "efectuar",
  "visual": "",
  "choices": [
   "efectuar",
   "contestar",
   "obsequio",
   "fatigado"
  ],
  "explanation": "«realizar» y «efectuar» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "lexical",
   "from": "realizar",
   "to": "efectuar",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-07",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «fácil»?",
  "correct": "sencillo",
  "visual": "",
  "choices": [
   "sencillo",
   "complicado",
   "acabar",
   "agradable"
  ],
  "explanation": "«fácil» y «sencillo» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "fácil",
   "to": "sencillo",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-08",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «tranquilo»?",
  "correct": "sosegado",
  "visual": "",
  "choices": [
   "sosegado",
   "obsequio",
   "fatigado",
   "coche"
  ],
  "explanation": "«tranquilo» y «sosegado» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "tranquilo",
   "to": "sosegado",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-09",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «responder»?",
  "correct": "contestar",
  "visual": "",
  "choices": [
   "contestar",
   "acabar",
   "agradable",
   "pelo"
  ],
  "explanation": "«responder» y «contestar» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-8",
  "check": {
   "kind": "lexical",
   "from": "responder",
   "to": "contestar",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-10",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «difícil»?",
  "correct": "complicado",
  "visual": "",
  "choices": [
   "complicado",
   "fatigado",
   "coche",
   "clase"
  ],
  "explanation": "«difícil» y «complicado» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-8",
  "check": {
   "kind": "lexical",
   "from": "difícil",
   "to": "complicado",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-11",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «regalo»?",
  "correct": "obsequio",
  "visual": "",
  "choices": [
   "obsequio",
   "agradable",
   "pelo",
   "hermoso"
  ],
  "explanation": "«regalo» y «obsequio» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-8",
  "check": {
   "kind": "lexical",
   "from": "regalo",
   "to": "obsequio",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-12",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «terminar»?",
  "correct": "acabar",
  "visual": "",
  "choices": [
   "acabar",
   "coche",
   "clase",
   "veloz"
  ],
  "explanation": "«terminar» y «acabar» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-8",
  "check": {
   "kind": "lexical",
   "from": "terminar",
   "to": "acabar",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-13",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «cansado»?",
  "correct": "fatigado",
  "visual": "",
  "choices": [
   "fatigado",
   "pelo",
   "hermoso",
   "efectuar"
  ],
  "explanation": "«cansado» y «fatigado» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "cansado",
   "to": "fatigado",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-SIN-14",
  "subject": "lang",
  "topic": "sinonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un sinónimo de «simpático»?",
  "correct": "agradable",
  "visual": "",
  "choices": [
   "agradable",
   "clase",
   "veloz",
   "sencillo"
  ],
  "explanation": "«simpático» y «agradable» tienen significado parecido.",
  "hint1": "Piensa en otra palabra que podría utilizarse con sentido parecido.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "simpático",
   "to": "agradable",
   "relation": "sinonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-01",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «estrecha»?",
  "correct": "ancha",
  "visual": "",
  "choices": [
   "ancha",
   "contaminado",
   "desconocido",
   "sencillo"
  ],
  "explanation": "«estrecha» y «ancha» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "estrecha",
   "to": "ancha",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-02",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «lleno»?",
  "correct": "vacío",
  "visual": "",
  "choices": [
   "vacío",
   "aburrido",
   "lento",
   "pequeño"
  ],
  "explanation": "«lleno» y «vacío» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "lleno",
   "to": "vacío",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-03",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «recta»?",
  "correct": "torcida",
  "visual": "",
  "choices": [
   "torcida",
   "desconocido",
   "sencillo",
   "encender"
  ],
  "explanation": "«recta» y «torcida» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "recta",
   "to": "torcida",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-04",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «puro»?",
  "correct": "contaminado",
  "visual": "",
  "choices": [
   "contaminado",
   "lento",
   "pequeño",
   "áspero"
  ],
  "explanation": "«puro» y «contaminado» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "puro",
   "to": "contaminado",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-05",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «entretenido»?",
  "correct": "aburrido",
  "visual": "",
  "choices": [
   "aburrido",
   "sencillo",
   "encender",
   "seco"
  ],
  "explanation": "«entretenido» y «aburrido» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "entretenido",
   "to": "aburrido",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-06",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «famoso»?",
  "correct": "desconocido",
  "visual": "",
  "choices": [
   "desconocido",
   "pequeño",
   "áspero",
   "bajo"
  ],
  "explanation": "«famoso» y «desconocido» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-1",
  "check": {
   "kind": "lexical",
   "from": "famoso",
   "to": "desconocido",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-07",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «rápido»?",
  "correct": "lento",
  "visual": "",
  "choices": [
   "lento",
   "encender",
   "seco",
   "poca"
  ],
  "explanation": "«rápido» y «lento» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "rápido",
   "to": "lento",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-08",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «difícil»?",
  "correct": "sencillo",
  "visual": "",
  "choices": [
   "sencillo",
   "áspero",
   "bajo",
   "ancha"
  ],
  "explanation": "«difícil» y «sencillo» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "difícil",
   "to": "sencillo",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-09",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «grande»?",
  "correct": "pequeño",
  "visual": "",
  "choices": [
   "pequeño",
   "seco",
   "poca",
   "vacío"
  ],
  "explanation": "«grande» y «pequeño» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "grande",
   "to": "pequeño",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-10",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «apagar»?",
  "correct": "encender",
  "visual": "",
  "choices": [
   "encender",
   "bajo",
   "ancha",
   "torcida"
  ],
  "explanation": "«apagar» y «encender» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-SINONIMOS-4",
  "check": {
   "kind": "lexical",
   "from": "apagar",
   "to": "encender",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-11",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «suave»?",
  "correct": "áspero",
  "visual": "",
  "choices": [
   "áspero",
   "poca",
   "vacío",
   "contaminado"
  ],
  "explanation": "«suave» y «áspero» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "lexical",
   "from": "suave",
   "to": "áspero",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-12",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «mojado»?",
  "correct": "seco",
  "visual": "",
  "choices": [
   "seco",
   "ancha",
   "torcida",
   "aburrido"
  ],
  "explanation": "«mojado» y «seco» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "lexical",
   "from": "mojado",
   "to": "seco",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-13",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «alto»?",
  "correct": "bajo",
  "visual": "",
  "choices": [
   "bajo",
   "vacío",
   "contaminado",
   "desconocido"
  ],
  "explanation": "«alto» y «bajo» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "lexical",
   "from": "alto",
   "to": "bajo",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-ANT-14",
  "subject": "lang",
  "topic": "antonimos",
  "variant": "drive",
  "prompt": "¿Cuál es un antónimo de «mucha»?",
  "correct": "poca",
  "visual": "",
  "choices": [
   "poca",
   "torcida",
   "aburrido",
   "lento"
  ],
  "explanation": "«mucha» y «poca» tienen significado contrario.",
  "hint1": "Busca una palabra que signifique lo opuesto.",
  "hint2": "Descarta las opciones que no mantienen la relación de significado.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "lexical",
   "from": "mucha",
   "to": "poca",
   "relation": "antonimos"
  }
 },
 {
  "id": "DRIVE-LANG-COM-01",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Lucía cuenta en voz alta a su hermano que han llegado sus abuelos. ¿Qué tipo de comunicación utiliza Lucía?",
  "correct": "verbal oral",
  "visual": "",
  "choices": [
   "verbal oral",
   "verbal escrita",
   "no verbal gestual",
   "no verbal visual"
  ],
  "explanation": "Las palabras pronunciadas constituyen comunicación verbal oral.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-3",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-02",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Eva deja a su familia una nota escrita. ¿Qué tipo de comunicación utiliza Eva?",
  "correct": "verbal escrita",
  "visual": "",
  "choices": [
   "verbal escrita",
   "verbal oral",
   "no verbal gestual",
   "no verbal sonora"
  ],
  "explanation": "La escritura utiliza palabras: comunicación verbal escrita.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-3",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-03",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Una niña levanta el pulgar para mostrar que está de acuerdo. ¿Qué tipo de comunicación utiliza?",
  "correct": "no verbal gestual",
  "visual": "",
  "choices": [
   "no verbal gestual",
   "verbal oral",
   "verbal escrita",
   "no verbal sonora"
  ],
  "explanation": "Un gesto transmite un mensaje sin utilizar palabras.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-3",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-04",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Un semáforo en verde indica que los vehículos pueden avanzar. ¿Qué recurso se emplea?",
  "correct": "señal visual",
  "visual": "",
  "choices": [
   "señal visual",
   "lenguaje oral",
   "carta escrita",
   "conversación"
  ],
  "explanation": "El color del semáforo es una señal visual no verbal.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-COMUNICACION-2",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-05",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Una persona llama con un silbido a otra persona. ¿Qué medio usa para comunicarse?",
  "correct": "sonido",
  "visual": "",
  "choices": [
   "sonido",
   "carta",
   "gesto",
   "texto escrito"
  ],
  "explanation": "El silbido es una señal sonora no verbal.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-COMUNICACION-2",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-06",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Un profesor explica en voz alta un ejercicio a la clase. ¿Quién es el emisor?",
  "correct": "el profesor",
  "visual": "",
  "choices": [
   "el profesor",
   "el alumnado",
   "la pizarra",
   "el ejercicio"
  ],
  "explanation": "El emisor produce y envía el mensaje.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-07",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Una profesora enseña una ilustración a sus alumnos. ¿Quiénes son los receptores?",
  "correct": "los alumnos",
  "visual": "",
  "choices": [
   "los alumnos",
   "la profesora",
   "los rotuladores",
   "la imagen"
  ],
  "explanation": "Los receptores son quienes reciben la información.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-COMUNICACION-2",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-08",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Nora envía a su hermano un mensaje de texto mediante el móvil. ¿Qué canal utiliza?",
  "correct": "el teléfono móvil",
  "visual": "",
  "choices": [
   "el teléfono móvil",
   "Nora",
   "su hermano",
   "el mensaje"
  ],
  "explanation": "El canal es el medio que transporta la información.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-09",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Rubén avisa a su amiga de que mañana irá a visitarla. ¿Qué elemento expresa aquello que comunica?",
  "correct": "el mensaje",
  "visual": "",
  "choices": [
   "el mensaje",
   "el receptor",
   "el canal",
   "el contexto"
  ],
  "explanation": "El mensaje contiene la información transmitida.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-10",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Una chica utiliza el español escrito para comunicarse por correo. ¿Qué elemento es el español escrito?",
  "correct": "el código",
  "visual": "",
  "choices": [
   "el código",
   "el canal",
   "el emisor",
   "el receptor"
  ],
  "explanation": "El código es el sistema compartido de signos.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-11",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Dos amigos hablan cara a cara usando palabras. ¿Qué modalidad utilizan?",
  "correct": "comunicación verbal oral",
  "visual": "",
  "choices": [
   "comunicación verbal oral",
   "comunicación no verbal",
   "comunicación escrita",
   "señal visual"
  ],
  "explanation": "Conversar mediante palabras habladas es comunicación verbal oral.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-COMUNICACION-2",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-12",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Una persona levanta la mano para despedirse. ¿Qué forma de comunicación utiliza?",
  "correct": "no verbal",
  "visual": "",
  "choices": [
   "no verbal",
   "verbal escrita",
   "verbal oral",
   "narración"
  ],
  "explanation": "Un gesto no necesita palabras para comunicar.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-COMUNICACION-2",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-13",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "Un árbitro muestra una tarjeta roja a un jugador. ¿Qué medio transmite la información?",
  "correct": "una señal visual",
  "visual": "",
  "choices": [
   "una señal visual",
   "una llamada telefónica",
   "un libro",
   "una conversación"
  ],
  "explanation": "La tarjeta comunica mediante una señal visible.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-CONTROL-1",
  "check": {
   "kind": "communication"
  }
 },
 {
  "id": "DRIVE-LANG-COM-14",
  "subject": "lang",
  "topic": "comunicacion",
  "variant": "drive",
  "prompt": "La biblioteca anuncia en un cartel: «Cerramos a las seis». ¿Qué código aparece en el cartel?",
  "correct": "español escrito",
  "visual": "",
  "choices": [
   "español escrito",
   "señal sonora",
   "lenguaje oral",
   "mímica"
  ],
  "explanation": "Las palabras escritas emplean el código del español escrito.",
  "hint1": "Distingue quién habla, qué se comunica y qué medio utiliza.",
  "hint2": "Las palabras pueden ser orales o escritas; los gestos y sonidos no necesitan palabras.",
  "numeric": false,
  "source": "LEN-COMUNICACION-2",
  "check": {
   "kind": "communication"
  }
 }
];
 const reading={
 "title": "Las uvas del huerto (relato original)",
 "text": "Al amanecer, un zorro llegó a un huerto y vio unas uvas en una parra muy alta. Tenía hambre y saltó para alcanzarlas. Lo intentó varias veces, pero los racimos seguían demasiado lejos.\n\nAl final, el zorro se marchó sin probar ninguna uva. Para consolarse, dijo que tal vez estarían verdes. En realidad, se había cansado de saltar y estaba decepcionado por no conseguirlas.",
 "qa": [
  [
   "¿Dónde encontró el zorro las uvas?",
   "En un huerto."
  ],
  [
   "¿Por qué intentó alcanzar las uvas?",
   "Porque tenía hambre."
  ],
  [
   "¿Dónde estaban las uvas?",
   "En una parra muy alta."
  ],
  [
   "¿Qué hizo para intentar cogerlas?",
   "Saltó varias veces."
  ],
  [
   "¿Consiguió probar alguna uva?",
   "No, ninguna."
  ],
  [
   "¿Por qué dijo que quizá estuvieran verdes?",
   "Para consolarse al no conseguirlas."
  ]
 ],
 "source": "LEN-CONTROL-1",
 "original": true
};
 for(const q of questions)if(q.check&&["add","subtract"].includes(q.check.kind))
  q.visual=q.check.a+" "+(q.check.kind==="add"?"+":"−")+" "+q.check.b+" = ?";
 const byTopic=Object.groupBy?Object.groupBy(questions,q=>q.topic):
  questions.reduce((out,q)=>(out[q.topic]??=[]).push(q),{});
 window.LigaBancoDrive=Object.freeze({
  questions:Object.freeze(questions),
  reading:Object.freeze(reading),
  pick(topic,options={}){
   const pool=(byTopic[topic]||[]).filter(q=>
    !(options.stage===5&&topic==="descomponer")&&
    !([5,6].includes(options.stage)&&topic==="comunicacion")&&
    !(options.requiredSign&&topic==="operaciones"));
   if(!pool.length)return null;
   const row=pool[Math.floor(Math.random()*pool.length)];
   return {...row,choices:row.choices?[...row.choices]:null,fingerprint:row.id};
  },
  installReading(data){
   if(!data||!Array.isArray(data.readings))return false;
   if(!data.readings.some(x=>x.title===reading.title))data.readings.push({...reading,qa:reading.qa.map(x=>[...x])});
   return true;
  }
 });
})();
