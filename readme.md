Postman Collection
You can download the Postman collection using the following link: 
    [text](https://drive.google.com/file/d/16sGxJhKHff8H5q9bM_i-0TpHz-5fVsN3/view?usp=sharing)

How to Run the Application
Prerequisites:
Docker: Ensure that Docker is installed on your system. You can download it from Docker's official website.
Node.js: For running tests, Node.js should be installed on your system. You can download it from Node.js official website.
Steps to Run the Application:
Clone the repository and navigate to the project directory.
Build and start the application using Docker:

    docker-compose up --build

This command will:
Build the Docker images for both the PostgreSQL database and the application.

Set up the containers with PostgreSQL running on port 5432 and the application running on port 3000.

Note: You can modify the ports and other configurations from the .env file located in the project directory.

Running Tests:
To run the test cases:

Ensure Node.js is installed on your system.
Navigate to the project directory:
    cd path/to/project
Run the test suite using the following command:
    npm test
  
This will execute all the test cases within the codebase.



Implemented features:
\\TODO

Design Patterns Used:

Observer Pattern:

The Observer pattern is employed to decouple the logic for handling side effects (like logging) from the core business logic. This allows adding new observers in the future (e.g., notifications) without modifying the core methods like addExpense.
This pattern is particularly evident in the ExpenseService, where after creating transactions, observers are notified about the changes, ensuring clean separation of concerns.


Strategy Pattern:
The EqualSplitStrategy and ExactSplitStrategy classes implement the Strategy Pattern. This pattern provides flexibility in how expenses are split. The splitting logic is easily interchangeable based on the selected strategy (equal or exact). This promotes open-closed principle (OCP), allowing easy extension for new split strategies without modifying existing code.



Function Modularity:

GroupServices Modularity:
GroupServices.updateGroupUserList: This method follows good modular principles. Operations like finding valid users to add, removing users, and updating the group are clearly delineated. Breaking the logic into small, reusable methods (like getValidUsersToAdd and removeUsers) promotes cleaner, more testable code.
Methods like findGroupById and getValidUsersToAdd can be reused elsewhere, increasing the overall reusability of the code.


ExpenseService Modularity:
Methods like addExpense, updateExpense, and getExpensesByGroupId are neatly separated by their concerns. Each method performs a well-defined task, making it easy to understand and maintain.
The use of transaction handling in addExpense ensures that either all changes are committed together or none at all, preventing partial updates in case of failure.



Application of SOLID Principles:

Single Responsibility Principle (SRP):
Each service (UserServices, GroupServices, ExpenseService, etc.) has a single responsibility. For example, GroupServices focuses solely on group-related operations like updating user lists, while ExpenseService handles operations related to expenses and transactions.
Methods within these classes are also SRP-compliant. For example, updateGroupUserList manages the list of users in a group and delegates tasks like validation and updating the group to smaller, modular functions.


Open/Closed Principle (OCP):
The Strategy Pattern used in splitting expenses ensures that the system is open for extension but closed for modification. For example, if a new split method is introduced, you can simply add a new strategy without modifying existing logic.
The modular methods in GroupServices and ExpenseService can easily be extended without changing their existing behavior, promoting OCP.

Liskov Substitution Principle (LSP):
This principle applies more to class hierarchies. Since most of the services are independent, LSP isn’t directly applicable here, but if there were parent-child classes, the current design ensures no violations of LSP.

Interface Segregation Principle (ISP):
Each service focuses on a single task. There are no large, monolithic interfaces that force clients to depend on methods they don’t need, ensuring ISP is followed.


Dependency Inversion Principle (DIP) (enhancement):
While the models (User, Group, Transaction) are used directly, the application could benefit from adding a repository layer to adhere more closely to DIP. This would decouple the services from direct interaction with the database, allowing for more flexibility and easier testing.


Conclusion:
Modularity: The application is highly modular, with each class and method having a specific responsibility. This makes the code easy to maintain, extend, and test.
Reusability: The extracted methods and use of design patterns make the code reusable across different parts of the application, reducing duplication.
Scalability: By following SOLID principles and design patterns like Observer and Strategy, the codebase is well-prepared to handle future requirements and extensions without significant rewrites.





