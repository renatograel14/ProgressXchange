import application = require("application");

import trace = require("trace");
trace.setCategories(trace.categories.Layout);
trace.enable();

// Set the start module for the application
application.mainModule = "main-page";

// Start the application
application.start();
