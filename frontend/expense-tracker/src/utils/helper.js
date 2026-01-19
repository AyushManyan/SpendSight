export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


export const getInitials = (name) => {
    if(!name) return "";

    const words = name.trim().split(" ");
    let initals ="";
    for(let i=0; i< Math.min(2, words.length); i++) {
        initals += words[i][0].toUpperCase();
    }
    return initals;
}

export const addThousandSeparators = (num) => {
    if(num == null || isNaN(num)) return "";
    const [integerPart, fractionalPart] = num.toString().split(".");
    const withSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fractionalPart ? `${withSeparators}.${fractionalPart}` : withSeparators;
}