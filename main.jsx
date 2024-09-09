const { useState, useEffect, useReducer } = React;

// ヘルパー関数
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const initialState = {
  station: null,
  duration: null,
  amount: null,
};

// リデューサー関数
function reducer(state, action) {
  switch (action.type) {
    case "setStation":
      return { ...state, station: action.payload };
    case "setDuration":
      return { ...state, duration: action.payload };
    case "setAmount":
      return { ...state, amount: action.payload };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("data/stations.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData));
  }, []);

  const handleClick = () => {
    const randomStation = getRandomElement(data);
    const randomDuration = Math.floor(Math.random() * 8) / 2 + 1;
    const randomAmount = (Math.floor(Math.random() * 4) + 1) * 1000;
    dispatch({ type: "setStation", payload: randomStation });
    dispatch({ type: "setDuration", payload: randomDuration });
    dispatch({ type: "setAmount", payload: randomAmount });
  };

  let cashEmoji = "";

  if (state.amount) {
    for (let i = 0; i < state.amount / 1000; i++) {
      cashEmoji += " 💴";
    }
  }

  return (
    <div className="container">
      <button onClick={handleClick} className="button">
        行き先を決める
      </button>

      <section className="section result-section">
        <h2>降車駅</h2>
        {state.station && (
          <div>
            <div className="station-wrapper">
              <p>
                {state.station.name} ({state.station.city})
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&origin=My%20Location&destination=${state.station.name}%20(${state.station.city})&travelmode=transit`}
                className="button direction-button"
              >
                🚃 経路を見る
              </a>
            </div>
            <p>路線: {state.station.routeInfo.join(", ")}</p>
          </div>
        )}
      </section>
      <section className="section result-section">
        <h2>滞在時間</h2>
        {state.duration && <p>{state.duration} 時間以上</p>}
      </section>
      <section className="section result-section">
        <h2>使用可能金額</h2>
        {state.amount && (
          <p>
            {state.amount}円 {cashEmoji}
          </p>
        )}
      </section>
    </div>
  );
};

const target = document.querySelector("#app");
const root = ReactDOM.createRoot(target);
root.render(<App />);
