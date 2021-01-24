// Anushka Lodha, Harshita Gangaswamy, Sangita Kunapuli, Shivani Sista
// TechTogether Seattle Hackathon: 1/22/21 - 1/24/21
// Project: We created a Discord bot that connects to the Google Books API and retrieves information on 
// relevant and highly rated books that educate the user about different cultures, racial (minority) backgrounds, and 
// the issues that these groups of people have faced in the past and still face today

const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
require('dotenv').config()
const token = process.env.TOKEN
const book_key = process.env.BOOK_KEY

// List of key words for when user wants books recommendations for random topic
var keywords = [
    "multicultural", "black power", "black lives matter", "apartheid", "asian", "south asian",
    "partition", "mlk", "martin luther king jr.", "dolores huerta", "hispanic", "lgbtq", "uighurs",
    "nelson mandela", "judaism", "buddhism", "hinduism", "native american", "indigenous", 
    "white fragility", "antiblackness", "intersectional feminism", "phyllis wheatley", "minority myth",
    "malcolm x", "cesar chavez", "tamir rice", "michael brown ferguson", "claudia rankine", "islam", "people of color",
    "black women", "brown women", "blm", "audre lorde", "john lewis", "george floyd", "trayvon martin",
    "walter scott", "latinx", "latino", "transwomen", "transmen", "ida b wells", "mexican american", 
    "african american", "asian american", "japanese american", "chinese american", "korean american", "indian american",
    "american indian", "filipino", "middle east", "vietnamese american", "taiwanese american", "racial discrimination",
    "racial segregation", "jim crow laws", "xenophobia", "islamophobia", "people of color in media"];

client.on('ready', () => {
	console.log('This bot is ready!');
})

client.on('message', async msg=>{
    // User has to type '#random' to get books about random topic or '#insert-topic' if they already have an idea of what to read
    let prefix = "#";

    // Bot is activated when '#' prefix is used, else nothing happens
	if (!msg.content.startsWith(prefix))
		return

	const args = msg.content.slice(prefix.length).trim().split('\n');
	var command = args.shift().toLowerCase();
    
    // For users who want random topic
    if(command === 'random'){
        var i = Math.floor(Math.random() * keywords.length);
        command = keywords[i];
    }

    // Connect to Google Books API and get relevant titles related to topic (whether random or chosen)
    let getTitles = async() => {
        let response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=' + command + '&key=' + book_key)
        let titles = response.data.items
        return titles
    }
    let titleValue = await getTitles()

    // Create arrays for ratings and titles
    let titleArr = []
    let ratingArr = []
    
    // Iterate through top ten books shown by Google Books, add titles and ratings to newly created arrays
    // If book doesn't have rating, set its rating equal to 0 in the array
    for(let i = 0; i < 10; i++){
        if(titleValue[i].volumeInfo.averageRating === undefined)
            titleValue[i].volumeInfo.averageRating = 0;
        ratingArr.push(titleValue[i].volumeInfo.averageRating)
        titleArr.push(titleValue[i].volumeInfo.title)
    }
    
    // Use bubblesort sorting algorithm to rank books by rating (high to low)
    let temp1;
    let temp2;

    for(let i = 9; i >= 0; i--){
        for (let j = 1; j <= i; j++) {
            if (ratingArr[j-1] < ratingArr[j]) {
                temp1 = ratingArr[j]
                temp2 = titleArr[j]

                ratingArr[j] = ratingArr[j-1]
                titleArr[j] = titleArr[j-1]

                ratingArr[j-1] = temp1
                titleArr[j-1] = temp2
            }
        }
    }
    /*
    for(let i = 0; i < 10; i++){
        console.log(ratingArr[i])
        console.log(titleArr[i])
    }
    */
    
    // Reply on Discord channel with top three relevant books, and top three books based on rating
    msg.reply(
        `\nTopic: ${command}` +
        `\n\nTop books based on relevance: \n(1) ${titleValue[0].volumeInfo.title} \n(2) ${titleValue[1].volumeInfo.title} \n(3) ${titleValue[2].volumeInfo.title} \n\n` +
        `Top books based on rating: ` +
        `\n*Disclaimer: some titles may have a rating of 0 because their rating was undefined.*` +
        `\n(1) ${titleArr[0]} (${ratingArr[0]}/5) \n(2) ${titleArr[1]} (${ratingArr[1]} /5) \n(3) ${titleArr[2]} (${ratingArr[2]}/5)`)
    
    return
})
  
client.login(token)