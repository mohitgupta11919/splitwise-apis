class Observer {
    constructor() {
      this.observers = [];
    }
  
    // Add an observer
    addObserver(observer) {
      this.observers.push(observer);
    }
  
    // Notify all observers
    notify(message) {
    //   this.observers.forEach(observer => observer.update(message));
      console.log(message)
    }
  }
  
  // Example observer that logs messages to the console
  class ConsoleLogger {
    update(message) {
      console.log(message);
    }
  }
  
  module.exports = { Observer, ConsoleLogger };
