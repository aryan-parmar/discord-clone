import React, {useState} from 'react'

export default function ImojiButton() {
    var emojiArray = ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','🥰','😗','😙','😚','🙂','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😯','😫','🥱', '😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','🙁','😖','😞','😤','🤯']
    var [index, setIndex] = useState(0)
    var [emoji, setEmoji] = useState(emojiArray[index])
    function MouseOver(event) {
        if (index === emojiArray.length - 1){
            index = 0;
        }else{
            index +=1;
        }
        setIndex(index);
        setEmoji(emojiArray[index]);
        event.target.innerText = emoji;
        event.target.style.filter =	"grayscale(0)";
    }
    function MouseOut(event){
        event.target.style.filter =	"grayscale(100%)"
    }
    return (
        <div className="imoji noselect" onMouseOver={MouseOver} onMouseOut={MouseOut}>{emoji}</div>
    )
}
