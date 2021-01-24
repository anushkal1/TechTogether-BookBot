const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const token = "ODAyNjU1ODM0NTM0MTgyOTIy.YAyZfw.KeDIRBS77srs3mqV7z8Sr91W7xg";
const APIkey = "AIzaSyBOHfFoi9j6YOduHWXkxsYe9kpNLWwBFsw";

let isAge = false;
let age = 0;
let books = {
    book1: "",
    book2: "",
    book3: "",
};

//make messages become automatic so its daily
//add more keywords
let keywords = ["multicultural", "black power", "black lives matter", "hispanic"];

//refine search so that we take top 3
function findBooks(content){
    fetch(`https://www.googleapis.com/books/v1/volumes?q=` + content + `&key=` + APIkey)
        .then(response => response.json())
        .then(result => {
            console.log(result.items[0].volumeInfo.averageRating);
    });
}

function messageBooks(channel){
    channel.send(books.book1);
    channel.send(books.book2);
    channel.send(books.book3);
}

//send 'How old are you?' as the first message only one time
//after that ask if they want book recommendations
client.once('ready', () => {
    console.log('Ready!');
    if(isAge === false){
        //send message
        client.on('message', message => {
            age = message.content;
        });
    }
    //send message: 'What kind of books would you like?'
});

client.on('message', async message => {
    console.log(message.content);
    if(message.content === "random"){
        var i = Math.floor(Math.random() * keywords.length);
        findBooks(keywords[i]);
    } else {
        findBooks(message.content);
    }
    messageBooks(message.channel);

});

client.login(token);