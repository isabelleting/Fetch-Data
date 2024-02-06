const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
  
    useEffect(() => {
      console.log("Fetching data...");
  
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  
  function App() {
    const { Fragment, useState, useEffect, useReducer } = React;
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "https://api.quotable.io/quotes/random?limit=10",
      {
        data: []
      }
    );
    console.log("Rendering App");
  
    let quotes = data.data;
  
    return (
      <Fragment>
        {isError && <div>Something went wrong ...</div>}
  
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <ul className="list-group">
            {quotes?.map((item) => (
              <li className="list-group-item" key={item._id}>
                {item.content}
              </li>
            ))}
          </ul>
        )}
      </Fragment>
    );
  }
  
  // ========================================
  ReactDOM.render(<App />, document.getElementById("root"));
  