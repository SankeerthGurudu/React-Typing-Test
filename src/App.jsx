import { useCallback, useState,useRef,useEffect } from 'react'
import './App.css'
import { paragraphs}  from './paragraphs'
import Content  from './Content'

let ranIndex = Math.floor(Math.random() * paragraphs.length);

function App() {
  const maxTime = 60;
  const [paragraph, setparagraph] = useState(paragraphs[ranIndex]);
  const [word, setword] = useState('');
  const [charIndex, setcharIndex] = useState(0);
  const [time, settime] = useState(maxTime)
  const [mistakes, setmistakes] = useState(0)
  const [wpm, setwpm] = useState(0) //words per minute
  const [cpm, setcpm] = useState(0) //Character per minute
  const [acc, setacc] = useState(0) //Accuracy

  const totalChars=useRef(0);
  const totalCorrectChars=useRef(0);
  const timer = useRef();

  //Auto Focus Input
  const callbackRef = useCallback(inputEl=>{
    if(inputEl){
      document.addEventListener("keydown",()=>inputEl.focus())
    }
  },[])
  
  useEffect(() => {
    if(timer.current && time >0){
      timer.current=setTimeout(()=>settime(t=>t-1),1000)
    }

    if(time <=0){
      clearTimeout(timer.current);
      return;
    }
    
  }, [time])
  

  const handleInput = (e) => {
    const {value}  = e.target;
    // console.log(value);

    if(time <=0 || value.length > paragraph.length) return ;
    console.log(value);
    setword(value);
    setcharIndex(value.length);

    const {mistakes,cpm,wpm}=testCalculator(paragraph,value);

    setmistakes(mistakes);
    setcpm(cpm)
    setwpm(wpm)
    testAccuracy(value, paragraph)

    if(!timer.current){
      timer.current=setTimeout(()=>settime(t=>t-1),1000);
    }
  }

  function testCalculator(originalValue,typedValue){
    // console.log({originalValue: originalValue.split(''),typedValue: typedValue.split('')})
    const mistakes=typedValue.split('').reduce((acc,typedChar,index)=>{
      return typedChar!==originalValue[index]? acc+1:acc
    },0)

    const cpm=typedValue.length-mistakes;

    const wpm=cpm/5; //1wpm=5cpm

    // console.log(mistakes);
    return {mistakes, cpm,wpm}
  }

  function testAccuracy(value, paragraph){
    //backspace doesn't work
    if(value.length>charIndex){
      // console.log(value[charIndex])
      totalChars.current+=1;
      if(value[charIndex]===paragraph[charIndex]){
        totalCorrectChars.current+=1;
      }
      // console.log(totalChars.current,totalCorrectChars.current)
      setacc(totalCorrectChars.current/totalChars.current*100)
    }
  }

  const handleTryAgain=()=>{
    if(time>0) return;
    handleReset()
  }

  function handleReset(){
    setword('');
    setcharIndex(0);
    settime(maxTime);
    setmistakes(0);
    setwpm(0);
    setcpm(0);
    setacc(0);
    clearTimeout(timer.current);

    totalChars.current=0;
    totalCorrectChars.current=0;
    timer.current=undefined;
  }

  function handleRestart(){
    let ri=Math.floor(Math.random()* paragraphs.length);

    if(ri!=ranIndex){
      ranIndex=ri;
      setparagraph(paragraphs[ri]);
      handleReset()
    }else{
      handleRestart()
    }
  }

  return (
    <>
      <div className="App">
        <h1>Typing Speed Test</h1>
        <h2>Test your typing skills</h2>

        <div className="tab">
          <div className="timer" onClick={handleTryAgain}>
            {
              time > 0
                ? <>
                  <p>{time}</p>
                  <small>seconds</small>
                </>
                : <small>Try Again!</small>
            }
          </div>

          <div className="square">
            <p>{Math.floor(wpm)}</p>
            <small>words/min</small>
          </div>

          <div className="square">
            <p>{cpm}</p>
            <small>chars/min</small>
          </div>

          <div className="square">
            <p>{mistakes}</p>
            <small>mistakes</small>
          </div>

          <div className="square">
            <p>{Math.round(acc)}</p>
            <small>% accuracy</small>
          </div>

        </div>

        <input type="text" value={word} autoFocus onChange={handleInput} ref={callbackRef} style={{opacity:0}}/>

        <Content paragraph={paragraph} word={word} charIndex={charIndex}/>

        <span className='restart' onClick={handleRestart}>&#x27F3;</span>
      </div>
    </>
  )
}

export default App
