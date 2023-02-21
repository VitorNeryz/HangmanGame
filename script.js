import { categorias } from "./words.js"; 

(function(){
    function randomWord(){
        const selectedIndex = document.querySelector(".select-category").selectedIndex;
        const categoryLenght = categorias[selectedIndex].length;
        let secretWord = categorias[selectedIndex][parseInt(Math.random() * categoryLenght)];
        return secretWord.toLowerCase();
    }
    let secretWord;

    let lettersList = document.querySelector(".secret-word__list-letters");
    // cria o tabuleiro das letras;
    function createWordBox(){
        secretWord = randomWord();
        console.log(lettersList);
        for(let i = 0; i <= (secretWord.length - 1);i++){
            const li = document.createElement('li');
            li.classList.add("list-letters__item");
            lettersList.appendChild(li);
        }
    }
    const keyboard = document.querySelectorAll('.keyboard__item');
    //todas as funções do teclado
    const keyboardFunctions = {
        show:{
            greenHit(letter){ letter.classList.add("keyboard__item--green-hit") },

            redHit(letter){ letter.classList.add("keyboard__item--red-hit") }
        },

        removeHover(letter){
            letter.classList.remove("keyboard__item--hover");
        },

        disableLetter(letter){
            letter.onclick = () =>{ return false };
        },
        
        disableKeyboard(keyboard){
            keyboard.forEach((keycap)=>{
                keycap.onclick = () =>{ return false };
            })
        },
        addKeyboardEvent(){
            keyboard.forEach((keycap)=>{
                keycap.onclick = () => verifyLetter(keycap);
            })
        }
    }

    let btnStart = document.querySelector('.btn-start');
    //adiciona o evento ao botão start ao carregar a pagina
    window.onload = btnStart.addEventListener("click",()=>{
        let menu = document.querySelector(".game-container__menu");
        menu.classList.add("hidden");
        createWordBox();
        keyboardFunctions.addKeyboardEvent();
    });

    function changeHangman(missedLetters){
        let hangman = document.querySelector(".hangman");
        if(missedLetters == 7){
            hangman.src = `./media/hangman_dead.png`
        }else{
            hangman.src = `./media/erro_${missedLetters}.png`
        };
    };

    //mostra a letra no tabuleiro
    let showLetter = (result)=>{
        result.forEach((letter)=>{
            if(letter == null){
                return;
            }
            lettersList.childNodes[letter.index + 1].innerHTML = `<p class="letter">${letter}</p>`;
        })
    }
    
    let scoreGame = 0 ,missedLetters = 0;
    //Verifica a letra teclada na palavra secreta
    const verifyLetter = (letter)=>{
        const regex = new RegExp(`${letter.textContent.toLowerCase()}`,"g");
        let result = [];
        for(let i = 0; i <= secretWord.length;i++){
            result.push(regex.exec(secretWord));
            if(result[i] === null){
                break;
            }
        }
        console.log(result); 
        keyboardFunctions.removeHover(letter);
        keyboardFunctions.disableLetter(letter);

        if(result[0] != null){
            keyboardFunctions.show.greenHit(letter);
            result.forEach((i)=> i ? scoreGame++ : false);
            showLetter(result);
            if(scoreGame == secretWord.length){
                alert("YOU WIN !!!");
            }
        }else{
            keyboardFunctions.show.redHit(letter);
            missedLetters ++;
            changeHangman(missedLetters);
            if(missedLetters === 7){
                alert("Game Over");
                keyboardFunctions.disableKeyboard(keyboard);
            }
        }
    }
})();