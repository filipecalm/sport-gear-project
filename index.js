// Calculando o cosseno de um número
const angle = 45;
const cosine = Math.cos(angle * Math.PI / 180);
console.log(`O cosseno de ${angle} graus é ${cosine}`);

// Encontrando o valor máximo e mínimo de um conjunto de números
const numbers = [10, 5, 7, 15, 3];
const maxValue = Math.max(...numbers);
const minValue = Math.min(...numbers);
console.log(`O valor máximo é ${maxValue} e o valor mínimo é ${minValue}`);

// Calculando a potência de um número
const base = 2;
const exponent = 5;
const result = Math.pow(base, exponent);
console.log(`${base} elevado a ${exponent} é igual a ${result}`);

// Gerando um número aleatório entre 0 e 1
const randomNum = Math.random();
console.log(`Um número aleatório entre 0 e 1: ${randomNum}`);
