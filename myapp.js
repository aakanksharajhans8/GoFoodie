import cuisineList from './cuisine.js';

async function populateDropdown() {
    try {
        let select = document.querySelector("#cuisine-select");
        // Add default option
        let defaultOption = document.createElement("option");
        defaultOption.text = "Recipe by Cuisine";
        defaultOption.value = "";
        select.appendChild(defaultOption);
        cuisineList.forEach(cuisine => {
            let newOption = document.createElement("option");
            newOption.innerText = cuisine;
            newOption.value = cuisine;
            select.appendChild(newOption);
        });
    } catch (error) {
        console.error('Error populating dropdown:', error);
    }
}
populateDropdown();

//FUNCTIONS
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'fe280768c5mshe1d534a2c744427p1d6a52jsnd6c859877fe3',
        'x-rapidapi-host': 'all-in-one-recipe-api.p.rapidapi.com'
    }
};

//Function to get recipe by its ID.
async function getRecipe(myurl, nameTag, descriptionTag, ulElement, box, bigBox, ulElementt) {
    const url = 'https://all-in-one-recipe-api.p.rapidapi.com/details/';
    const URL = `${url}${myurl}`;
    try {
        const response2 = await fetch(URL, options);
        const result2 = await response2.json();
        const ingredients = result2.recipe.data.Ingredients;
        const steps = result2.recipe.data.Directions;
        const name = result2.recipe.data.Name;
        const description = result2.recipe.data.Description;

        nameTag.innerText = name;
        nameTag.style.fontWeight = "bold";
        descriptionTag.innerText = description;

        console.log("INGREDIENTS = ", ingredients);

        ingredients.forEach(ingredient => {
            const liElement = document.createElement('li');
            liElement.textContent = ingredient;
            liElement.style.textAlign = "justify";
            ulElement.appendChild(liElement);
            box.style.display = "flex";
        });

        console.log("PROCEDURE = ", steps);

        steps.forEach(step => {
            const liElement = document.createElement('li');
            liElement.textContent = step;
            liElement.style.textAlign = "justify";
            ulElementt.appendChild(liElement);
            bigBox.style.display = "flex";
            bigBox.style.flexDirection = "column";
            bigBox.style.justifyContent = "center";
            box.style.display = "flex";
        });
    }
    catch (error) {
        console.error(error);
    }
}

//Random Recipe Generator function
async function getRandomRecipe(nameTag, descriptionTag, ulElement, box, bigBox, ulElementt) {
    const url = 'https://all-in-one-recipe-api.p.rapidapi.com/random';
    try {
        const response3 = await fetch(url, options);
        const result3 = await response3.json();
        // console.log(result3.recipe.data.Name);
        const ingredients = result3.recipe.data.Ingredients;
        const steps = result3.recipe.data.Directions;
        const name = result3.recipe.data.Name;
        const description = result3.recipe.data.Description;

        nameTag.innerText = name;
        nameTag.style.fontWeight = "bold";
        descriptionTag.innerText = description;

        ingredients.forEach(ingredient => {
            const liElement = document.createElement('li');
            liElement.textContent = ingredient;
            liElement.style.textAlign = "justify";
            ulElement.appendChild(liElement);
            bigBox.style.display = "flex";
            bigBox.style.flexDirection = "column";
            bigBox.style.justifyContent = "center";
            box.style.display = "flex";
        });

        steps.forEach(step => {
            const liElement = document.createElement('li');
            liElement.textContent = step;
            liElement.style.textAlign = "justify";
            ulElementt.appendChild(liElement);

        });
    } catch (error) {
        console.error(error);
    }
}

//SEARCH ICON
let searchIcon = document.querySelector('#search img');
let home = document.querySelector("#home");
let navbar = document.querySelector(".navbar");
let inputBox;
let submitButton;

searchIcon.addEventListener('click', () => {
    if (!inputBox) {
        // Create the input box
        inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = "Search food recipe";
        inputBox.id = "search_input";
        // inputBox.style.position = "fixed";
        navbar.after(inputBox);

        // Create the submit button
        submitButton = document.createElement("button");
        submitButton.innerText = "Submit";
        submitButton.id = "submit_button";
        inputBox.after(submitButton);
        // submitButton.style.position = "fixed";

        // Disable the search icon
        searchIcon.style.pointerEvents = "none";

        // Add event listener to the input box
        inputBox.addEventListener('input', () => {
            if (inputBox.value.trim() !== "") {
                searchIcon.style.pointerEvents = "auto";
            } else {
                searchIcon.style.pointerEvents = "none";
            }
        });

        let recipeID;
        // Add event listener to the submit button
        submitButton.addEventListener('click', async () => {
            if (inputBox.value.trim() !== "") {
                const url = `https://all-in-one-recipe-api.p.rapidapi.com/search/${inputBox.value}`;
                async function getRecipeID() {
                    try {
                        const response1 = await fetch(url, options);
                        const result1 = await response1.json();
                        if (result1.recipes && result1.recipes.data && result1.recipes.data.length > 0) {
                            recipeID = result1.recipes.data[0].id;
                            console.log(`RecipeId for ${inputBox.value} is = `, recipeID);
                        } else {
                            console.error("No recipes found or unexpected response structure");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
                getRecipeID().then(async () => {
                    const para = document.querySelector("#recipe-by-search p");
                    if (recipeID) {
                        const URL2 = `${recipeID}`;
                        const nameTag = document.querySelector("#recipe-by-search #search_name");
                        const descriptionTag = document.querySelector("#recipe-by-search #search_description");
                        const ulElement = document.getElementById('ingredientList');
                        const bigBox = document.querySelector("#recipe-by-search .bigBox");
                        const box = document.querySelector("#recipe-by-search .box");
                        const ulElementt = document.getElementById('procedureList');
                        await getRecipe(URL2, nameTag, descriptionTag, ulElement, box, bigBox, ulElementt);
                        para.style.display = "none";
                    }
                    else {
                        para.innerText = "We are sorry no recipe found, please search for anything else!"
                    }
                });

                // Redirect to the section
                document.querySelector('#recipe-by-search').scrollIntoView({ behavior: 'smooth' });
                searchIcon.style.pointerEvents = "auto";
                inputBox.remove();
                submitButton.remove();
                inputBox = null;
                submitButton = null;
            }
        });
    }
});

//Recipe by cuisine
const select = document.querySelector("#cuisine-select");
select.addEventListener("change", async (evt) => {
    const selectedCuisine = evt.target.value;
    let recipeID;
    console.log("Selected cuisine : ", selectedCuisine);
    const cuisine_url = `https://all-in-one-recipe-api.p.rapidapi.com/cuisines/${selectedCuisine}`;
    async function getRecipeID() {
        try {
            const response1 = await fetch(cuisine_url, options);
            const result1 = await response1.json();
            if (result1.cuisines && result1.cuisines.data && result1.cuisines.data.length > 1) {
                recipeID = result1.cuisines.data[1].id;
                console.log(`RecipeId for ${selectedCuisine} is = `, recipeID);
            } else {
                console.error("No recipes found or unexpected response structure");
            }
        } catch (error) {
            console.error(error);
        }
    }
    getRecipeID().then(async () => {
        const para = document.querySelector("#recipe-by-cuisine p");
        if (recipeID) {
            const URL2 = `${recipeID}`;
            const nameTag = document.querySelector("#recipe-by-cuisine #cuisine_name");
            const descriptionTag = document.querySelector("#recipe-by-cuisine #cuisine_description");
            const bigBox = document.querySelector("#recipe-by-cuisine .bigBox");
            const ulElement = document.getElementById('cuisineIngredientList');
            const box = document.querySelector("#recipe-by-cuisine .box");
            const ulElementt = document.getElementById('cuisineProcedureList');
            await getRecipe(URL2, nameTag, descriptionTag, ulElement, box, bigBox, ulElementt);
            para.style.display = "none";
        }
        else {
            para.innerText = "We are sorry no recipe found, please search for anything else!"
        }
    });
    // Redirect to the section
    document.querySelector('#recipe-by-cuisine').scrollIntoView({ behavior: 'smooth' });
});

//Random recipe
const randomBtn = document.querySelector("#fetch-random-recipe");
randomBtn.addEventListener("click", () => {
    const nameTag = document.querySelector("#random-recipe #random_name");
    const descriptionTag = document.querySelector("#random-recipe #random_description");
    const ulElement = document.getElementById('randomIngredientList');
    const bigBox = document.querySelector("#random-recipe .bigBox");
    const box = document.querySelector("#random-recipe .box");
    const ulElementt = document.getElementById('randomProcedureList');
    getRandomRecipe(nameTag, descriptionTag, ulElement, box, bigBox, ulElementt);
    randomBtn.style.display = "none";
});

//QUESTION ANSWER DISPLAY
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    const homeSection = document.getElementById('home');
    const questionnaire = document.getElementById('questionnaire');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const extraInput = document.getElementById('extra-input');
    const nextButton = document.getElementById('next');

    const questions = [
        {
            question: "How are you today?",
            options: ["Happy", "Sad", "Neutral"],
            type: "radio"
        },
        {
            question: "Do you have any dietary restrictions?",
            options: ["Yes", "No"],
            type: "conditional",
            condition: "Yes"
        },
        {
            question: "What type of meal are you looking for?",
            options: ["Breakfast", "Lunch", "Dinner"],
            type: "radio"
        },
        {
            question: "What is your cooking skill level?",
            options: ["Okayish", "Good", "Amazing"],
            type: "radio"
        }
    ];

    let currentQuestionIndex = 0;

    startButton.addEventListener('click', () => {
        homeSection.style.display = 'none';
        questionnaire.style.display = 'flex';
        showQuestion();
    });

    nextButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            if (extraInput.style.display === 'block' && extraInput.value.trim() !== "") {
            }
            extraInput.value = "";
            extraInput.style.display = 'none';
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                const nameTag = document.querySelector("#kaamKiCheez #name");
                const descriptionTag = document.querySelector("#kaamKiCheez #description");
                const ulElement = document.getElementById('kaamKiCheezIngredientList');
                const box = document.querySelector("#kaamKiCheez .box");
                const bigBox = document.querySelector("#kaamKiCheez");
                const ulElementt = document.getElementById('kaamKiCheezProcedureList');
                getRandomRecipe(nameTag, descriptionTag, ulElement, box, bigBox, ulElementt);
                nameTag.style.textAlign = 'center';
                nameTag.style.margin = '5px';
                descriptionTag.style.textAlign = 'center';
                homeSection.style.display = 'none';
                questionnaire.style.display = 'none';
                // Reset for next session
                currentQuestionIndex = 0;
                answers.length = 0;
            }
        } else {
            alert("Please select an option before proceeding.");
        }
    });

    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;
        optionsContainer.innerHTML = "";

        currentQuestion.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.style.textAlign = 'left';
            optionElement.style.fontSize = '1.25rem';
            optionElement.innerHTML = `
			<input type="radio" id="${option}" name="option" value="${option}">
			<label for="${option}">${option}</label>
		`;
            optionsContainer.appendChild(optionElement);
        });

        if (currentQuestion.type === "conditional") {
            optionsContainer.querySelectorAll('input[name="option"]').forEach(option => {
                option.addEventListener('change', (e) => {
                    if (e.target.value === currentQuestion.condition) {
                        extraInput.style.display = 'block';
                    } else {
                        extraInput.style.display = 'none';
                    }
                });
            });
        }
    }
});