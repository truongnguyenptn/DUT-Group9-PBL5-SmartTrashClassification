
$(document).ready(function(){

//console.log('hello');

var btn = document.getElementById("button");

//console.log(btn);

//add event listener to btn
btn.addEventListener("click", function () {
     //console.log('added event listener to btn 1')

    var form = document.getElementById("files");
    console.log(form)
    var form_data = new FormData(form);
    $.ajax({
        	url: "/predict",
        	type: "post",
        	data: form_data,
        	contentType: false,
        	processData: false,
        	success : function(data) {
				var prediction = data['class'];
                document.getElementById("prediction").innerHTML = prediction;
                
                // Display the uploaded image
                var imageURL = URL.createObjectURL(form_data.get('img'));
                var imageElement = document.createElement("img");
                imageElement.src = imageURL;
				imageElement.style.width = "300px"; 
                imageElement.style.height = "300px"; 
                document.getElementById("uploaded-image").innerHTML = ""; // Clear previous image
                document.getElementById("uploaded-image").appendChild(imageElement);
        	},
        	error : function(data,error){
        		console.log(error);
        		prediction = data['class'];
        		console.log(data);
        		console.log(prediction);
        		document.getElementById("prediction").innerHTML = prediction;
        	}
        });
});

//console.log('added event listener to btn 2')



 


	
})



