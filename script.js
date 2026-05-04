const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";




lengthSlider.addEventListener("input", (e) => {
   lengthDisplay.textContent = lengthSlider.value;

})


generateButton.addEventListener("click", makePassword)


function makePassword() {
   const length = Number(lengthSlider.value)
   const incUppercase = uppercaseCheckbox.checked
   const incLowercase = lowercaseCheckbox.checked
   const incNumbers = numbersCheckbox.checked
   const incSymbols = symbolsCheckbox.checked

   if (!incLowercase && !incUppercase && !incNumbers && !incSymbols) {
      alert("Please Select at least one Character type.");
      return
   }

   const newPasword = createRandomPassword(length, incUppercase, incLowercase, incNumbers, incSymbols);

   // update display to new pasword
   passwordInput.value = newPasword;
   // strength meter
   updateStrengthMeter(newPasword)
}

function createRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
   let allCharacters = ""

   if (includeUppercase) allCharacters += uppercaseLetters;
   if (includeLowercase) allCharacters += lowercaseLetters;
   if (includeNumbers) allCharacters += numberCharacters;
   if (includeSymbols) allCharacters += symbolCharacters;

   let password = "";

   for (let i = 0; i < length; i++) {
      // create a random index
      const randomIndex = Math.floor(Math.random() * allCharacters.length)
      password += allCharacters[randomIndex]
   }

   return password
}


function updateStrengthMeter(password) {
   const passwordLength = password.length;
   const hasupperCase = /[A-Z]/.test(password);
   const hasLowercase = /[a-z]/.test(password);
   const hasNumbers = /[0-9]/.test(password);
   const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

   let strengthScore = 0;

   // here the .min will get the minimum value
   // but this will make sure that "at maximum" you would get 40
   strengthScore += Math.min(passwordLength * 2, 40);

   if (hasupperCase) strengthScore += 15
   if (hasLowercase) strengthScore += 15
   if (hasNumbers) strengthScore += 15
   if (hasSymbols) strengthScore += 15

   // enforse minium score for every short password
   if (passwordLength < 8) {
      strengthScore = Math.min(strengthScore, 40)
   }

   // ensure the width of the strength bar is a valid percentage
   const safeScore = Math.max(5, Math.min(100, strengthScore))
   strengthBar.style.width = safeScore + "%";

   let strengthLableText = ""
   let barColor = ""

   if (strengthScore < 40) {
      // weak password
      barColor = "#fc8181";
      strengthLabelText = "Weak";
   } else if (strengthScore < 70) {
      // Medium password
      barColor = "#fbd38d"; // Yellow
      strengthLabelText = "Medium";
   } else {
      // Strong password
      barColor = "#68d391"; // Green
      strengthLabelText = "Strong";
   }

   strengthBar.style.backgroundColor = barColor;
   strengthLabel.textContent = strengthLabelText;

}


// refresh passwords on window reload
window.addEventListener("DOMContentLoaded", makePassword)

// Copy functionality
copyButton.addEventListener("click", () => {
   if (!passwordInput.value) return

   navigator.clipboard.writeText(passwordInput.value).then(() => showCopySuccess).catch((error) => {
      console.log("Could Not Coppy", error)
   })
});

// NOTES FIX COPY BTN -----------------------------------
function showCopySuccess() {
   copyButton.classList.remove("far", "fa-copy");
   copyButton.classList.add("fas", "fa-check");
   copyButton.style.color = "#48bb78";

   setTimeout(() => {
      copyButton.classList.remove("fas", "fa-check");
      copyButton.classList.add("far", "fa-copy");
      copyButton.style.color = "";
   }, 1500);
}