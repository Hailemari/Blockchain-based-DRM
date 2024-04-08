const Greetings = () => {
    const time = new Date().getHours();
    let greeting;
  
    if (time < 12) {
      greeting = "Good Morning";
    } else if (time < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
    return <h1 className="text-2xl font-bold">{greeting}</h1>;
  }

export default Greetings;