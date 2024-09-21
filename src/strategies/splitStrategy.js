class SplitStrategy {
    split(totalAmount, participants) {
      throw new Error("Strategy method not implemented");
    }
  }
  
  class EqualSplitStrategy extends SplitStrategy {
    split(totalAmount, participants) {
      const share = totalAmount / participants.length;
      return participants.reduce((result, user) => {
        console.log(result)
        result[user] = share;
        return result;
      }, {});
    }
  }
  
  class ExactSplitStrategy extends SplitStrategy {
    split(totalAmount, participants, shares) {
      return shares;
    }
  }
  
  module.exports = { EqualSplitStrategy, ExactSplitStrategy };
  