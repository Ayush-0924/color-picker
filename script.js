const colorPickerBtn = document.querySelector("#color-picker");
const clearAll = document.querySelector(".clear-all");
const colorList = document.querySelector(".all-colors");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

// Function to copy the color code to the clipboard and update the element text
const copyColor = (elem) => {
    elem.innerText = "Copied";
    navigator.clipboard.writeText(elem.dataset.color);
    setTimeout(() => elem.innerText = elem.dataset.color, 1000);
}

// Function to display the picked colors
const showColor = () => {
    if (!pickedColors.length) return; // Returning if there are no picked colors
    colorList.innerHTML = pickedColors.map(color => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color === "#ffffff" ? "#ccc" : color}"></span>
            <span class="value hex" data-color="${color}">${color}</span>
        </li>
    `).join(""); // Generating li for the picked color and adding it to the colorList
    document.querySelector(".picked-colors").classList.remove("hide");

    // Add a click event listener to each color element to copy the color code
    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild));
    });
}
showColor();

// Function to activate the eye dropper and pick a color
const activateEyeDropper = () => {
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            // Opening the eye dropper and getting the selected color
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);

            // Adding the color to the list if it doesn't already exist
            if (!pickedColors.includes(sRGBHex)) {
                pickedColors.push(sRGBHex);
                localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
                showColor();
            }
        } catch (error) {
            alert("Failed to copy the color code!");
        }
        document.body.style.display = "block";
    }, 10);
}

// Function to clear all picked colors, update local storage, and hide the colorList element
const clearAllColors = () => {
    pickedColors.length = 0;
    localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
    document.querySelector(".picked-colors").classList.add("hide");
}

// Event listeners
clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);

// Function to display previous picked colors in a dialogue box
const showPrevPickedColors = () => {
    if (!pickedColors.length) return; // Returning if there are no picked colors

    const prevColorsDialog = document.createElement('div');
    prevColorsDialog.classList.add('prev-colors-dialog');
    prevColorsDialog.innerHTML = `
        <div class="dialog-content">
            <h2>Previously Picked Colors</h2>
            <ul class="prev-colors-list">
                ${pickedColors.map(color => `
                    <li class="color">
                        <span class="rect" style="background: ${color}; border: 1px solid ${color === "#ffffff" ? "#ccc" : color}"></span>
                        <span class="value hex" data-color="${color}">${color}</span>
                    </li>
                `).join('')}
            </ul>
            <button class="close-dialog">Close</button>
        </div>
    `;

    document.body.appendChild(prevColorsDialog);

    // Event listener to close the dialog
    document.querySelector('.close-dialog').addEventListener('click', () => {
        prevColorsDialog.remove();
    });

    // Add a click event listener to each color element to copy the color code
    document.querySelectorAll('.prev-colors-list .color').forEach(li => {
        li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild));
    });
}

// Button to show previously picked colors
const showPrevColorsBtn = document.createElement('button');
showPrevColorsBtn.innerText = 'Show Previous Colors';
showPrevColorsBtn.classList.add('show-prev-colors');
document.body.appendChild(showPrevColorsBtn);

showPrevColorsBtn.addEventListener('click', showPrevPickedColors);
