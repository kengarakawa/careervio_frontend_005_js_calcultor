import CalcButton from "./components/CalcButton"
import { useState } from "react"

function App() {
  const [opr1, setOpr1] = useState("0")
  const [optr, setOptr] = useState(null)
  const [opr2, setOpr2] = useState(null)
  const [output, setOutput] = useState(null)
  const [content, setContent] = useState("opr1")

  const addNumber = (item) => {
    // primary case, do nothing if E
    if (opr1 === "E") {
      return false
    }

    // if no operator was set, taregt opr1
    if (optr === null) {
      if (item === ".") {
        // ignore, if the decimal dot was there
        if (opr1.indexOf(".") >= 0) {
          return
        }
        setOpr1(opr1 + item)
        setContent("opr1")
      } else {
        setOpr1(opr1 === "0" ? item : opr1 + item)
        setContent("opr1")
      }
    } else {
      // optr was set, now target opr2
      setOpr2(opr2 === "0" || opr2 === null ? item : opr2 + item)
      setContent("opr2")
    }
  }
  
  
  const addOperator = (item) => {
    // ignore operators if in any error states
    if (
      opr1 === "E" ||
      opr1 === Number.NEGATIVE_INFINITY ||
      opr1 === Number.POSITIVE_INFINITY ||
      Number.isNaN(opr1)
    ) {
      return false
    }

    // if operation was complete without pressing equal?
    if (optr !== null && opr1 !== "" && opr2 !== null) {
      // do calculate first
      let val = doCalculate(false)
      
      // then set output as opr1 
      // reset the current output
      setOpr1(val)
      setOptr(item)
      setContent("opr1")
      setOutput(null)
      return
    }


    // some operator is already there?
    if (optr != null && item ==='-') {
      
      // if more than 2 operators were entered, overwrite the second only if +,-  , or overwrite first when *,/
      if (optr.length === 2) {
        if (
          (item === "+" || item === "-") &&
          (optr[0] === "*" || optr[1] === "/")
        ) {
          setOptr(optr[0] + item)
          return
        }
        if (item === "*" || item === "/" || item === "%") {
          setOptr(item)
          return 
        }
      }

      // check if only single operator was set and is *,/
      if (optr === "*" || optr === "/") {
        // allow extra for + or -
        if (item === "+" || item === "-") {
          setOptr(optr + item)
          return
        }
      }
      
      if ((optr === "+" || optr === "-") && (item === "+" || item === "-")) {
        setOptr(optr + item)
        return
      }

      if (opr2 !== null) {
        doCalculate()
      }
    } 

    // operator pressed while output was on
    if (opr1 === "0" && output !== null) {
      console.log("Pushing output to opr1")
      setOpr1(output)
    }
    setOptr(item)
  }
  
  const clear = () => {
    setOptr(null)
    setOpr1("0")
    setOpr2(null)
    setOutput(null)
    setContent("opr1")
  }

  const doCalculate = (resetOperator = true) => {
    
    // nothing to do, simply return 
    if (optr === null) {
      return
    }
    
    // divided by zero prevention
    if (optr === "/" && opr2 === "0") {
      setOpr1('E')
      setContent('opr1')
      return 
    }

    // output of the calculation
    let val = null
    // if with extra length operator (- , apply negative status to opr2)
    let realOptr = optr    
    let factor = 1
    if (optr.length === 2) {
      factor = optr[1] === '-' ? -1 : 1       
      realOptr = optr[0]
    }
    
    
    switch (realOptr) {
      case "+":
        val = parseFloat(opr1) + parseFloat(opr2) * factor
        break
      case "-":
        val = parseFloat(opr1) - parseFloat(opr2) * factor
        break
      case "*":
        val = parseFloat(opr1) * parseFloat(opr2) * factor
        break
      case "/":
        val = (parseFloat(opr1) / parseFloat(opr2)) * factor
        break
      case "%":
        val = (parseFloat(opr1) * parseFloat(opr2)) / 100
        break
      default:
        break
    }

    
    setOutput(val)
    setContent("output")
    // reset the rest?
    setOpr1("0")
    setOpr2(null)
    if (resetOperator) {
      setOptr(null)
    }
    return val
  }


  return (
    <div className="container-fluid">
      <div className="debug">
        {`opr1 : ${opr1} optr : ${optr} opr2 : ${opr2} output : ${output}`}
      </div>

      <div className="App ">
        <div id="calculator">
          <div className="" id="display">          
            {content === "opr1" ? opr1 : content === "opr2" ? opr2 : output}
          </div>

          <CalcButton
            className="b7"
            label="7"
            id="seven"
            onClick={() => addNumber("7")}
          />
          <CalcButton
            className="b8"
            label="8"
            id="eight"
            onClick={() => addNumber("8")}
          />
          <CalcButton
            className="b9"
            label="9"
            id="nine"
            onClick={() => addNumber("9")}
          />
          <CalcButton
            className="b4"
            label="4"
            id="four"
            onClick={() => addNumber("4")}
          />
          <CalcButton
            className="b5"
            label="5"
            id="five"
            onClick={() => addNumber("5")}
          />
          <CalcButton
            className="b6"
            label="6"
            id="six"
            onClick={() => addNumber("6")}
          />
          <CalcButton
            className="b1"
            label="1"
            id="one"
            onClick={() => addNumber("1")}
          />
          <CalcButton
            className="b2"
            label="2"
            id="two"
            onClick={() => addNumber("2")}
          />
          <CalcButton
            className="b3"
            label="3"
            id="three"
            onClick={() => addNumber("3")}
          />
          <CalcButton
            className="b0"
            label="0"
            id="zero"
            onClick={() => addNumber("0")}
            span="2"
          />
          <CalcButton
            className="bdot"
            id="decimal"
            label="."
            onClick={() => addNumber(".")}
          />

          <CalcButton
            className="add"
            id="add"
            label="+"
            onClick={() => addOperator("+")}
          />
          <CalcButton
            className="subtract"
            id="subtract"
            label="-"
            onClick={() => addOperator("-")}
          />
          <CalcButton
            className="multiply"
            id="multiply"
            label="X"
            onClick={() => addOperator("*")}
          />
          <CalcButton
            className="divide"
            id="divide"
            label="/"
            onClick={() => addOperator("/")}
          />

          <CalcButton
            className="percentage"
            id="percentage"
            label="%"
            onClick={() => addOperator("%")}
          />

          <CalcButton
            className="equal"
            id="equals"
            label="="
            onClick={() => doCalculate()}
          />
          <CalcButton
            className="clear"
            id="clear"
            label="C"
            onClick={() => clear("XXX")}
          />
        </div>
      </div>
    </div>
  )
}

export default App
