import axios from "axios";
import * as fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';


interface Meal{
    id: string,
    name: string,
    category: string,
    instructions: string,
    video: string,
    ingredients: {ingredient: string, measure: string}[],
}

const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
const mealMap: Map<string, Meal> = new Map();



async function getMeal(){

    for (const char of chars){
        try{
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`)
            const meals = response.data.meals
            if (meals !== null){
                for (const meal of meals){

                    const ingredients = [];

                    for (let i = 1; i < 21; i++){
                        const ingredient = {
                            ingredient: meal[`strIngredient${i}`], 
                            measure: meal[`strMeasure${i}`]
                        }
                        if (ingredient.ingredient !== "" && ingredient.ingredient){
                            ingredients.push(ingredient)
                        }
                        
                    }

                    let video = meal.strYoutube;

                    if (!video) {
                        video = "";
                    }

                    const mealObject = {
                        id: meal.idMeal, 
                        name: meal.strMeal, 
                        category: meal.strCategory,
                        instructions: meal.strInstructions,
                        video: video,
                        ingredients: ingredients
                    }

                    if (mealMap.get(mealObject.id) === undefined){
                        mealMap.set(mealObject.id, mealObject);
                    }
                    else{
                        console.log("exists already")
                    }
                }
            }

        } catch (error){
            console.error(`Error fetching meals for ${char}`, error)
        }
    }

    await writeMealsToCSV();
}

async function writeMealsToCSV(){
    const csvWriter = createObjectCsvWriter({
        path: "meals.csv",
        header: [
            {id: "id", title: "ID"},
            {id: "name", title: "Name"},
            {id: "category", title: "Category"},
            {id: "instructions", title: "Instructions"},
            {id: "video", title: "Video"},
            {id: "ingredients", title:"Ingredients"},
        ]
    });

    const records = Array.from(mealMap.values()).map(meal => ({
        id: meal.id,
        name: meal.name,
        category: meal.category,
        instructions: meal.instructions,
        video: meal.video,
        ingredients: meal.ingredients
        .map(i => `${i.ingredient}: ${i.measure}`).join("; ")
    }));

    await csvWriter.writeRecords(records);
    console.log(`Successfully wrote ${records.length} meals to meals.csv`)
}


getMeal();