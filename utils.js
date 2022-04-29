function collision({player1, player2}){
    return (
        player1.attackArea.position.x + player1.attackArea.width >= player2.position.x &&
        player1.attackArea.position.x <= player2.position.x + player2.width &&
        player1.attackArea.position.y + player1.attackArea.height >= player2.position.y &&
        player1.attackArea.position.y <= player2.position.y + player2.height
    )
}

function determineWinner({ hero, enemy, timerId }){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if(hero.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie'
    }else if (hero.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    }else if (hero.health < enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerId
function countTimer() {
    if(timer>0){
        timerId = setTimeout(countTimer, 1000);
        timer -= 1;
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0){
        determineWinner({ hero, enemy, timerId });
    }
}