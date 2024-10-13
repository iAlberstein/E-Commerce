export function generateResetToken(){
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return token.toString(); 
}

