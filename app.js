/*
@description: server running the phonetic alphabet app
@author: Ming-Yiu Wong 
@since:2/5/18
@modified:17/5/18
*/
/*
Information:
ID:26926040
Monash University
Clayton
FIT3036
Tutor: David Dowe
Tutorial Time: 12:00 pm Fri
*/


var fs =require('fs')
         , http=require('http')
		 , socketio=require('socket.io');
		 
var server=http.createServer(function(req, res) {						//creating server
            res.writeHead(200, { 'Content-type': 'text/html'});
            res.end(fs.readFileSync(__dirname+'/input.html'));
            }).listen(8080, function() {
			console.log('Listening at: http://localhost:8080');
			});
var alphac=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
var dict = require("dict");
var random=require('random-number');
var clone=require("clone");
var words=[];
var syllables=[];


var d1 = dict({							//create dictionary of words
	apple: "ap uhl",
	appricot: "ap ri cot",
	alpha: "al fuh",
	banana: "buh nan uh",
	beet: "beet",
	bravo: "brah voh",
	carrot: "kar uht",
	cherry: "cher ee",
	charlie: "chahr lee",
	durian: "doo ree uhn",
	drain: "dreyn",
	delta: "del tuh",
	eggplant: "eg plant",
	edamame: "ed uh mah mey",
	echo: "ek oh",
	fig: "fig",
	feijoa: "fey yoh uh",
	foxtrot: "foks trot",
	grape: "greyp",
	ginger: "jin jer",
	golf: "golf",
	horseradish: "hawrs rad ish",
	hyper: "hahy per",
	hotel: "hoh tel",
	igloo: "ig loo",
	istanbul: "is tahn bool",
	india:"in dee uh",
	jackfruit: "jak froot",
	jump: "juhmp",
	juliet: "joo lee uht",
	kale: "keyl",
	kiwi: "kee wee",
	kilo: "kil oh",
	lemon: "leh muhn",
	leek: "leek",
	lima: "lee muh",
	mango: "mang goh",
	mushroom: "muhsh room",
	mike: "mahyk",
	nectarine: "nek tuh reen",
	ninja:"nin juh",
	november: "noh vem ber",
	orange: "awr inj",
	olive: "ol iv",
	oscar:"os ker",
	plum:"pluhm",
	prune:"proon",
	papa: "pah puh",
	quince: "kwins",
	question: "kwes chuhn",
	quebec: "kwi bec",
	rhubarb: "roo bahrb",
	ram: "ram",
	romeo: "roh mee oh",
	strawberry:"straw ber ee",
	squash: "skwosh",
	sierra: "see er uh",
	turnip: "tur nip",
	teardrop: "teer drop",
	tango: "tang goh",
	usual: "yoo zhoo uhl",
	utter: "uht er",
	uniform: "yoo nuh fawrm",
	vice: "vahys",
	vocal: "voh kuhl",
	victor:"vik ter",
	wrist: "rist",
	welcome: "wel kuhm",
	whiskey: "hwis kee",
	xylophone: "zahy luh fohn",
	xavier: "zet vee er",
	xray: "eks rey",
	yvonne: "ih von",
	yttrium: "ih tree uhm",
	yankee: "yang kee",
	zinc: "zingk",
	zwitterion: "tsvit er ahy uhn",
	zulu: "zoo loo"

});
var d2 = dict({						//stores the number of syllables in the word
	apple:  2,
	appricot: 3,
	alpha: 2,
	banana: 3,
	beet: 1,
	bravo: 2,
	carrot:2,
	cherry: 2,
	charlie: 2,
	durian: 3,
	drain: 1,
	delta: 2,
	eggplant: 2,
	edamame: 4,
	echo: 2,
	fig: 1,
	feijoa: 3,
	foxtrot: 2,
	grape: 1,
	ginger: 2,
	golf: 1,
	horseradish: 3,
	hyper: 2,
	hotel: 2,
	igloo: 2,
	istanbul: 3,
	india:3,
	jackfruit: 2,
	jump: 1,
	juliet: 3,
	kale: 1,
	kiwi: 2,
	kilo: 2,
	lemon: 2,
	leek: 1,
	lima: 2,
	mango: 2,
	mushroom: 2,
	mike: 1,
	nectarine: 3,
	ninja:2,
	november: 3,
	orange: 2,
	olive: 2,
	oscar:2,
	plum:1,
	prune:1,
	papa: 2,
	quince: 1,
	question: 2,
	quebec: 2,
	rhubarb: 2,
	ram: 1,
	romeo: 3,
	strawberry:3,
	squash: 1,
	sierra: 3,
	turnip: 2,
	teardrop: 2,
	tango: 2,
	usual: 3,
	utter: 2,
	uniform: 3,
	vice: 1,
	vocal: 2,
	victor:2,
	wrist: 1,
	welcome: 2,
	whiskey: 2,
	xylophone: 3,
	xavier: 3,
	xray: 2,
	yvonne: 2,
	yttrium: 3,
	yankee: 2,
	zinc: 1,
	zwitterion: 4,
	zulu: 2

});
socketio.listen(server).on('connection', function (socket) {

	
	socket.on('submit',function(board){				//recieves form from html page				
		console.log(board);
		words=board;
		var counter=0;
		var check=true;
		var check2=true;
		var letter=[]

		for (i=0;i<board.length;i++)				//makes sure all inputs are valid
		{
			
			if(board[i]=='')						//checks empty textboxs
			{
				socket.emit('message',1);
				check=false;
			}

			if(board[i].charAt(0)!=alphac[i])		//checks for invalid starting letter
			{
				check=false;
				check2=false;
				letter.push(alphac[i]);
				
			}
		}
		
		if(check)									//no invalid input
		{
			var check3=true;
			var wordcheck=[]
			for (i=0;i<board.length;i++)			
			{
				if(!(d1.has(board[i])))				//checks if word is in dictionary
				{
					check3=false;
					wordcheck.push(board[i]);		//puts all words inputted into array
				}
			}
			if (check3)
			{
				var avelength=0;
				var wordsyl=[]
				var pwords=[];
				for (i=0;i<board.length;i++)
				{
					avelength+=d2.get(board[i])		//gets the value of the number of syllables in the alphabet
				}
				avelength=avelength/26;
				for (i=0;i<board.length;i++)		//puts each phoneme into its corresponding slot
				{
					wordsyl=d1.get(board[i]).split(' ')
					console.log(wordsyl)
					syllables[i]=clone(wordsyl)
				}

				var score=0;							//scores the alphabet by looking at similarities in the phonemes
				var totalscore=0;
				for (i=0;i<syllables.length;i++)
				{
					for (j=0;j<syllables.length;j++)
					{
						if(i==j)
						{

						}
						else{
							for(k=0;k<syllables[i].length;k++)
							{
								for(l=0;l<syllables[j].length;l++)
								{
									if(syllables[i][k][syllables[i][k].length-1]==syllables[j][l][syllables[j][l].length-1])
									{
										if(syllables[i][k][syllables[i][k].length-2]==syllables[j][l][syllables[j][l].length-2])
										{
											if(syllables[i][k]==syllables[j][l])
											{
												score+=1;
											}
											else{
												score+=0.5;
											}
										}
										else{
											score+=0.1;
										}
									}
									
								}
								
								
							}
							
						}
					
					}
					
					score=score/d2.get(board[i])
					console.log(score)
					if (score>3)									//finds words which have a high individual score
					{
					
						pwords[counter]=board[i];
						counter++;
					}
					totalscore+=score;
					score=0
				}
				
				var pwordmes="These words may be problematic: ";	//transforms the list of problematic words into a message
				for (i=0;i<pwords.length;i++)
				{
					pwordmes+=pwords[i];
					if (i<pwords.length-1)
					{
						pwordmes+=', ';
					}
				}
				socket.emit('message',0);
				socket.emit('info',avelength,totalscore,pwordmes)	//sends data back to html page
			}	
			else{								
				var newmessage="The word/s "						//creates a message for words that do not exist in the dictionary
				for (i=0;i<wordcheck.length;i++)
				{
					newmessage+=wordcheck[i];
					if (i<wordcheck.length-2)
					{
						newmessage+=', '
					}
					else if (i==wordcheck.length-2)
					{
						newmessage+=' and '
					}
					else{
						newmessage+=' do not exist in the dictionary'
					}
				}
				socket.emit('wronginput',newmessage);				//sends message to html page
			}
		}
		else if(check2==false)										//constructs message for words that don't start with the correct letter		
		{
			console.log(letter)
			//if(letter.length<10)
			//{
				var newmessage="The words for letter/s "
				for (i=0;i<letter.length;i++)
				{
					newmessage+=letter[i];
					if (i<letter.length-2)
					{
						newmessage+=', '
					}
					else if (i==letter.length-2)
					{
						newmessage+=' and '
					}
					else{
						newmessage+=' do not start with the correct letters'
					}
				}
			//}
			//else{
			//	var newmessage="please fill in the form properly";
			//}
			console.log(newmessage)
			socket.emit('wronginput',newmessage); 					//sends message back to html page
		}
	})

	socket.on('encode', function(message,noise){					//encoder
		var output="";
		var check4=true;
		var output2="";
		for (i=0;i<message.length;i++)
		{
			if(check4)
			{
				check4=false;
				for(j=0;j<alphac.length;j++)
				{
					
					if (message.charAt(i)==alphac[j])				//makes sure the letter is valid and adds it to the array if it is
					{
						check4=true;
						output+=words[j];
						output2+=words[j];
						output+=" ";
						output2+=" ";
					}
				}
			}
			if(!(check4))
			{
				socket.emit('encodedmessage',"Invalid input")		//sends message if message has invalid characters
			}

			
		}
		if (check4)
		{
		var noiselevel=noise*(output.length-message.length)			//rng
		var options = {
			min:0,
			max:output.length-1,
			integer:true
		}
		var option2={
			min:0,
			max:50,
			integer:true
		}
		var randomnumber;
		var randomnumber2;
		console.log(output)
		for(k=0;k<noiselevel;k++)
		{
			randomnumber=random(options);
			if (output.charAt(randomnumber)==' ')					//makes sure the noise isnt added to a blank space
			{
				k--;
			}
			else if (output.charAt(randomnumber)!=output2.charAt(randomnumber))
			{
				k--;
			}
			else{
				randomnumber2=random(option2);
				if (randomnumber2>25)
				{
					output=output.substring(0,randomnumber)+'_'+output.substring(randomnumber+1);		//adds a letter if rng<26
				}
				else{
					output=output.substring(0,randomnumber)+alphac[randomnumber2]+output.substring(randomnumber+1); //adds a blank if rng>=26
				}
			
				
			}
		}
		socket.emit('encodedmessage',output);		//sends encoded message back to html page
		
		}	
	})
	socket.on('decode', function(message){			//decoder
		var decodewords=message.split(" ")
		var count;
		var decodemessage=[];
		var decodemessageinsert=[];
		var counter1=0;
		var counter2=0;
		var finalmessage="";
		
		for (i=0;i<decodewords.length;i++)
		{
			count=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			for (j=0;j<decodewords[i].length;j++)			//sees which letter is the most likely for each 'word' in the message
			{
				
				for(k=0;k<words.length;k++)
				{
					if(decodewords[i][j]==words[k][j])
					{
						count[k]++;
					}
				}
				
			}
			if(Math.max(...count)<=1)						//makes sure letter is not just a slim possibility
			{
				decodemessage[counter1]="_";
				finalmessage='Not Enough Information\n Results: '
			}
			else{
			for(l=0;l<count.length;l++)
			{
				
				if(count[l]==Math.max(...count))
				{
					decodemessageinsert.push(alphac[l]);	//adds possible letters to a list
					//counter2++;
				}
				
			}
			decodemessage[counter1]=clone(decodemessageinsert); //makes an array of letters which could be in the corresponding position
			decodemessageinsert=[]
			}
			//counter2=0;
			counter1++;

		}
		var result=[];
		var check5=true;
		console.log(decodemessage);
		for(i=0;i<decodemessage.length;i++)						//creates the strings of the message which the message to correspond to
		{
			var time=result.length
			for(j=0;j<decodemessage[i].length;j++)
			{
				if (check5==true)							
				{
					result.push(decodemessage[i][j])			//starts the list by pushing the possible first letters
				}
				else{
					
					
					if(j==0)
					{
						for(k=0;k<time;k++)
						{
							
							result[k]=result[k].substring(0,result[k].length)+decodemessage[i][j];		//adds the second letters to the strings
						}
					}
					else if(j>=1)
					{
					
						for(l=0;l<time;l++)
						{
							result.push(result[l].substring(0,result[l].length-1)+decodemessage[i][j])	//adds new strings but with other possible letters
						}
					}
				}
			}
			check5=false
		}
		console.log(result)
		if(!(finalmessage))							//constructs decoded message
		{
			finalmessage="These are the most likely answers: "
		}
		for(i=0;i<result.length;i++)
		{
			finalmessage+=result[i];
			if (i<result.length-1)
			{
				finalmessage+=', ';
			}
		}
		console.log(finalmessage);
		socket.emit('decodemessage',finalmessage);	//sends message to html page
	})

	socket.on('disconnect', function (){			//tells user the other person disconnected

	})
});
