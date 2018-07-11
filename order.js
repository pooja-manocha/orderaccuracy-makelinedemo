

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
				["img3.gif","img3.gif","img3.gif", "img3.jpg", "img3.jpg", "img3.jpg"],
				["img4.gif","img4.gif","img4.gif", "img4.jpg", "img4.jpg", "img4.jpg"]
			],			
			"pizzaToppings": [  
				"Sauce",
				"Cheese",
				"Pepperoni",
				""
			],
			"stepTime": [  
				"00:00:10",
				"00:00:10",
				"00:00:10",
				"00:00:00"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],
			"createdDate": new Date(Date.now()).toLocaleString() 
		},
		// order 2
		 {
			"orderId": 2,
			"name": "The Works",
			"description": "Description about 12 topping pizza",
			"images": [
				["img5.png","img5.png","img5.png","img5.png","img5.png","img5.png"], 
				["img6.png","img6.png","img6.png","img6.png","img6.png","img6.png"],
				["img7.png","img7.png","img7.png","img7.png","img7.png","img7.png"],
				["img8.png","img8.png","img8.png","img8.png","img8.png","img8.png"]
			],
			"pizzaToppings": [
				"Sauce",
				"Veggies",
				"Meat",
				"Cheese"
			],
			"stepTime": [  
				"00:00:10",
				"00:00:40",
				"00:00:30",
				"00:00:10"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],  
			"createdDate": new Date(Date.now()).toLocaleString()
		},
		// order 3  
		  {
			"orderId": 3, 
			"name": "Custom",
			"description": "Description about half and half pizza", 
			"images": [
				["img9.jpg","img9.jpg","img9.jpg","img9.png","img9.png","img9.png"], 
				["img10.jpg","img10.jpg","img10.jpg","img10.png","img10.png","img10.png"],
				["img11.jpg","img11.jpg","img11.jpg","img11.png","img11.png","img11.png"],
				["img12.jpg","img12.jpg","img12.jpg","img12.png","img12.png","img12.png"]
			],
			"pizzaToppings": [
				"Sauce",
				"",
				"Meat",
				"Cheese"
			],
			"stepTime": [  
				"00:00:10",
				"00:00:00",
				"00:00:20",
				"00:00:10"
			],
			"pizzaCrust": ["HALF_BAKED", "BAKED", "CRISPY", "BURNT", "ON_FIRE"],
			"createdDate": new Date(Date.now()).toLocaleString()
		} 
	]
};
module.exports = pizzaOrder;