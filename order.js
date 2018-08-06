

var pizzaOrder = {
	"orders": [
		// order 1
		{
			"orderId": 1,
			"name": "Pepperoni",
			"description": "Description about Pepperoni pizza",
			"images": [
				["01pepperoniSauce.gif"], 
				["02pepperoniCheese.gif"],
				["03pepperoniRingOutside.gif","04pepperoniRingInner.gif","05pepperoniRingFinish.gif"],
				["gotooven.jpg"]
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
				"01"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],
			"pizzaTime" : "120",
			"subScreens":{ //configure the number of subscreens on each screen
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
				["01worksSauce.gif"], 
				["02worksSausage.gif","03worksBacon.gif"],
				["04worksMushroom.gif","05worksPepper.gif","06worksOnion.gif","07worksOlives.gif","08worksRonis.gif"],
				["09worksCheese.gif","gotooven.jpg"]
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
				"20"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],  
			"pizzaTime" : "180",
			"subScreens":{  //dynamically configure the number of subscreens on each screen
				"screen1":{"isRotation":false,"numberOfSubScreen":0},
				"screen2":{"isRotation":true,"numberOfSubScreen":2},
				"screen3":{"isRotation":true,"numberOfSubScreen":5},
				"screen4":{"isRotation":true,"numberOfSubScreen":2},
			},
			"createdDate": new Date(Date.now()).toLocaleString()

		},
		// order 3  
		  {
			"orderId": 3, 
			"name": "Custom",
			"description": "Description about half and half pizza", 
			"images": [
				["01halfSauce.gif"], 
				["movenext.png"],
				["02halfSausage.gif","03halfBacon.gif"],
				["04halfCheese.gif","gotooven.jpg"]
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
			"subScreens":{  //dynamically configure the number of subscreens on each screen
							"screen1":{"isRotation":false,"numberOfSubScreen":0},
							"screen2":{"isRotation":false,"numberOfSubScreen":0},
							"screen3":{"isRotation":true,"numberOfSubScreen":2},
							"screen4":{"isRotation":true,"numberOfSubScreen":2},
						},
			"createdDate": new Date(Date.now()).toLocaleString()
		} 
	]
};
module.exports = pizzaOrder;