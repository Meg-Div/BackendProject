const buttonOne = () => {
  document.querySelector("#buttonThree").disabled = true;
  document.querySelector("#buttonTwo").disabled = true;
};

const buttonTwo = () => {
  document.querySelector("#buttonOne").disabled = true;
  document.querySelector("#buttonThree").disabled = true;
};

const buttonThree = () => {
  document.querySelector("#buttonOne").disabled = true;
  document.querySelector("#buttonTwo").disabled = true;
};
