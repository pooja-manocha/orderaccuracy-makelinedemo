

var pizzaOrder = {
	"orders": [
		// order 1
		{
			"orderId": 1,
			"name": "Pepperoni",
			"description": "Description about Pepperoni pizza",
			"images": [
				["img1.gif","img1.gif","img1.gif", "img1.jpg", "img1.jpg", "img1.jpg"], 
				["img2.gif","img2.gif","img2.gif", "img2.jpg", "img2.jpg", "img2.jpg"],
				["img3.gif","img3.gif","img3.gif", "img3.jpg", "img3.jpg", "img3.jpg","img3.gif","img3.gif","img3.gif", "img3.jpg", "img3.jpg", "img3.jpg","img3.gif","img3.gif","img3.gif", "img3.jpg", "img3.jpg", "img3.jpg"],
				["img4.gif","img4.gif","img4.gif", "img4.jpg", "img4.jpg", "img4.jpg"]
			],			
			"pizzaToppings": [  
				"Sauce",
				"Cheese",
				"Pepperoni",
				""
			],
			"stepTime": [  
				"10",
				"10",
				"10",
				"00"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],
			"pizzaTime" : "120",
			"subScreens":{
				"screen1":{"isRotation":false,"numberOfSubScreen":0},
				"screen2":{"isRotation":false, "numberOfSubScreen":0},
				"screen3":{"isRotation":true,"numberOfSubScreen":3},
				"screen4":{"isRotation":false,"numberOfSubScreen":0},
			},
			"createdDate": new Date(Date.now()).toLocaleString()
		},
		// order 2
		 {
			"orderId": 2,
			"name": "The Works",
			"description": "Description about 12 topping pizza",
			"images": [
				["img5.png","img5.png","img5.png","img5.png","img5.png","img5.png"], 
				["img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png","img6.png"],
				["img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png","img7.png"],
				["img8.png","img8.png","img8.png","img8.png","img8.png","img8.png"]
			],
			"pizzaToppings": [
				"Sauce",
				"Veggies",
				"Meat",
				"Cheese"
			],
			"stepTime": [  
				"10",
				"40",
				"30",
				"10"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],  
			"pizzaTime" : "180",
			"subScreens":{
				"screen1":{"isRotation":false,"numberOfSubScreen":0},
				"screen2":{"isRotation":true,"numberOfSubScreen":3},
				"screen3":{"isRotation":true,"numberOfSubScreen":3},
				"screen4":{"isRotation":false,"numberOfSubScreen":0},
			},
			"createdDate": new Date(Date.now()).toLocaleString()

		},
		// order 3  
		  {
			"orderId": 3, 
			"name": "Custom",
			"description": "Description about half and half pizza", 
			"images": [
				["img9.jpg","img9.jpg","img9.jpg","img9.jpg","img9.jpg","img9.jpg"], 
				["img10.jpg","img10.jpg","img10.jpg","img10.jpg","img10.jpg","img10.jpg"],
				["img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg","img11.jpg"],
				["img12.jpg","img12.jpg","img12.jpg","img12.jpg","img12.jpg","img12.jpg"]
			],
			"pizzaToppings": [
				"Sauce",
				"",
				"Meat",
				"Cheese"
			],
			"stepTime": [  
				"10",
				"00",
				"20",
				"10"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],
			"pizzaTime" : "120",
			"subScreens":{
							"screen1":{"isRotation":false,"numberOfSubScreen":0},
							"screen2":{"isRotation":false,"numberOfSubScreen":0},
							"screen3":{"isRotation":true,"numberOfSubScreen":2},
							"screen4":{"isRotation":false,"numberOfSubScreen":0},
						},
			"createdDate": new Date(Date.now()).toLocaleString()
		} 
	]
};
module.exports = pizzaOrder;