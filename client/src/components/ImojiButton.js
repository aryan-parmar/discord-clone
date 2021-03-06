import React, {useState} from 'react'

export default function ImojiButton() {
    var emojiArray = ['๐','๐','๐','๐คฃ','๐','๐','๐','๐','๐','๐','๐','๐','๐','๐','๐ฅฐ','๐','๐','๐','๐','๐คฉ','๐ค','๐คจ','๐','๐','๐ถ','๐','๐','๐ฃ','๐ฅ','๐ฎ','๐ค','๐ฏ','๐ฏ','๐ซ','๐ฅฑ', '๐ด','๐','๐','๐','๐','๐คค','๐','๐','๐','๐','๐','๐ค','๐ฒ','๐','๐','๐','๐ค','๐คฏ']
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
