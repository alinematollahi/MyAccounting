var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// var bodyParser = require('body-parser')

const mongoose = require('mongoose');

//const updateMany = mongoose.updateMany();


const bcrypt = require('bcryptjs');

const cors = require('cors');

const User = require('./models/user');



// Construct a schema, using GraphQL schema language

var schema = buildSchema(`

  type Expense {
    _id : ID
    title: String
    amount: Money
    date : String
    category : MainCategory
  }

  type Income {
    _id : ID
    title: String
    amount: Money
    date : String
    category : MainCategory
  }

  type Money {
    value : Float
    currencyName : String
    type : String
  }

  type MainCategory {
    id : String
    categoryName : String
    subCategory: SubCategory1
  }

  type SubCategory1 {
    id : String
    categoryName : String
    subCategory: SubCategory2
  }

  type SubCategory2 {
    id : String
    categoryName : String
    subCategory: SubCategory3
  }

  type SubCategory3 {
    id : String
    categoryName : String
  }
  
  type User {
    _id : ID
    name : String
    email : String
    password : String
    expenses : [Expense]
    incomes : [Income]
    balance : [Money]
    expenseCategorys : [MainCategory]
    incomeCategorys : [MainCategory]
  }

  input ExpenseInput{
    id : String
    title: String
    amount: MoneyInput
    date : String
    category : MainCategoryInput
  }

  input IncomeInput{
    id : String
    title: String
    amount: MoneyInput
    date : String
    category : MainCategoryInput
  }

  input MoneyInput{
    value : Float
    currencyName : String
    type : String
  }

  input MainCategoryInput {
    id : String
    categoryName : String
  }

  input UserInput {
    name : String
    email : String
    password : String
    expenses : ExpenseInput
    incomes : IncomeInput
    expenseCategorys : MainCategoryInput
    incomeCategorys : MainCategoryInput
  }

  input UserEdit {
    oldExpenseCategorys : MainCategoryInput
    newExpenseCategorys : MainCategoryInput
    oldIncomeCategorys : MainCategoryInput
    newIncomeCategorys : MainCategoryInput
  }

  input RemoveItem {
    expenseCategory : MainCategoryInput
    incomeCategory : MainCategoryInput
  }

  type RootQuery{
    getUser(email : String , password : String ) : User
    getUserById(_id: ID ) : User
  }

  type RootMutation{
    addUser (userInput: UserInput) : User
    addInitialIncome(_id: ID, userInput: UserInput): User
    updateUser(_id: ID , userInput: UserInput) : User
    editUser(_id: ID , userEdit: UserEdit) : User
    removeUserItem(_id: ID , removeItem: RemoveItem) : User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);





// The root provides a resolver function for each API endpoint
var root = {
  getUser: (args) => {

    return User
      .findOne({ email: args.email })
      .then(user => {

        console.log(args.password, user.password);

        if (!user) {
          throw new Error('Invalid email')
        }

        const match = bcrypt.compareSync(args.password, user.password);

        if (match) {

          return { ...user._doc, _id: user.id }
        } else {
          throw new Error('Invalid input')
        }

      })
      /*
      .then(users=> {
        return users.map(user => {
          console.log({...user._doc});
          return { ...user._doc, _id: user._doc._id.toString() }
        })
      })
  
      */
      .catch(err => {
        throw (err)
      })
  },


  getUserById: (args) => {
    return User
      .findOne({ _id: args._id })
      .then(user => {
        console.log(user);
        if (!user) {
          throw new Error('User exists already')
        }
        return { ...user._doc, _id: user.id }
      })
  },

  addUser: (args) => {

    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error('User exists already')
        }
        return bcrypt
          .hash(args.userInput.password, 12)
      })
      .then(hashedpassword => {

        /*
  
        if(args.userInput.expenses){
          var expensesValue =  [{
            title: args.userInput.expenses[0].title,
            amount: {
              value : args.userInput.expenses[0].amount.value,
              currencyName : args.userInput.expenses[0].amount.currencyName
            }
          }];
        }else{
          var expensesValue = null;
        }
  
        if(args.userInput.incomes){
          var incomesValue =  [{
            title: args.userInput.incomes[0].title,
            amount: {
              value : args.userInput.incomes[0].amount.value,
              currencyName : args.userInput.incomes[0].amount.currencyName
            }
          }];
        }else{
          var incomesValue = null;
        }
  
        if(args.userInput.balance){
          var balanceValue =  [{
            
            
              value : args.userInput.balance[0].value,
              currencyName : args.userInput.balance[0].currencyName
        
          }];
        }else{
          var balanceValue = null;
        }
  
        */
        const user = new User({
          name: args.userInput.name,
          email: args.userInput.email,
          password: hashedpassword,
          expenses: [],
          incomes: [],
          balance: []
        })

        return user.save();
      })

      .then(result => {
        return { ...result._doc, password: null, _id: result.id }
      })
      .catch(err => {
        throw err;
      })
  },

  addInitialIncome: (args) => {

    console.log("initial Income", "args:", args.userInput.incomes);

    return User.findOne({ _id: args._id })
      .then(user => {
        console.log(user);

        user.incomes.push({
          id: args.userInput.incomes.id,
          title: args.userInput.incomes.title,
          date: args.userInput.incomes.date,
          amount: {
            value: args.userInput.incomes.amount.value,
            currencyName: args.userInput.incomes.amount.currencyName,
            type: args.userInput.incomes.amount.type
          },
          category: {
            categoryName: args.userInput.incomes.category.categoryName
          }
        })

        user.balance.push({
          value: args.userInput.incomes.amount.value,
          currencyName: args.userInput.incomes.amount.currencyName,
          type: args.userInput.incomes.amount.type
        })

        return user.save();

      })
      .catch(err => console.log(err))

  },

  updateUser: (args) => {

    console.log("::::::::::args.userInput.:::::::::", args.userInput);
    return User.findOne({ _id: args._id })
      .then(updateUser => {

        console.log(":::::::::updateUser:::::::::::::", updateUser);

        if (args.userInput.name) {
          updateUser.name = args.userInput.name
        }

        if (args.userInput.email) {
          updateUser.email = args.userInput.email
        }

        if (args.userInput.password) {
          updateUser.password = bcrypt.hash(args.userInput.password, 12)
        }

        if (args.userInput.incomes) {

          console.log("income  detect,   args.userInput.incomes::::", args.userInput.incomes);

          updateUser.incomes.push({
            id: args.userInput.incomes.id,
            title: args.userInput.incomes.title,
            date: args.userInput.incomes.date,
            amount: {
              value: args.userInput.incomes.amount.value,
              currencyName: args.userInput.incomes.amount.currencyName,
              type: args.userInput.incomes.amount.type
            },
            category: {
              categoryName: args.userInput.incomes.category.categoryName
            }
          });

          console.log("a");

          let isMathedIncomeExist = false;
          updateUser.balance.map(item => {

            if (item.currencyName === args.userInput.incomes.amount.currencyName
              && item.type === args.userInput.incomes.amount.type) {
              isMathedIncomeExist = true;
              console.log(item.value, args.userInput.incomes.amount.value);

              // We can't access to result of updateOne() in the next method(.then())
              // so returned result will look wrong,
              // But, in Database evrything is OK.
              User.updateOne({
                _id: args._id,
                balance: {
                  $elemMatch: {
                    currencyName: args.userInput.incomes.amount.currencyName,
                    type: args.userInput.incomes.amount.type
                  }
                }
              }, {
                $set: {
                  'balance.$.value': item.value + args.userInput.incomes.amount.value
                }
              },
                (err) => { console.log(err) }
              )
            }
          })

          console.log("b");


          if (!isMathedIncomeExist) {

            console.log("c");


            User.findOneAndUpdate({ _id: args._id }, {
              $push: {
                balance: {
                  value: args.userInput.incomes.amount.value,
                  currencyName: args.userInput.incomes.amount.currencyName,
                  type: args.userInput.incomes.amount.type
                }
              }

            },
              (err) => { console.log("error is:", err) }
            )




            /*
              updateUser.balance.push({
                value: args.userInput.incomes.amount.value,
                currencyName: args.userInput.incomes.amount.currencyName,
                type: args.userInput.incomes.amount.type
              })
   
              */
          }
        }

        if (args.userInput.expenses) {

          console.log("expense detected, args.userInput.expenses:", args.userInput.expenses);

          updateUser.expenses.push({
            title: args.userInput.expenses.title,
            date: args.userInput.expenses.date,
            amount: {
              value: args.userInput.expenses.amount.value,
              currencyName: args.userInput.expenses.amount.currencyName,
              type: args.userInput.expenses.amount.type
            },
            category: {
              categoryName: args.userInput.expenses.category.categoryName
            }
          });

          //let isMathedExpenseExist = false;
          updateUser.balance.map(item => {

            console.log(item.currencyName, args.userInput.expenses.amount.currencyName)
            console.log(item.type, args.userInput.expenses.amount.type);

            if (item.currencyName === args.userInput.expenses.amount.currencyName
              && item.type === args.userInput.expenses.amount.type) {
              //isMathedExpenseExist = true;
              console.log(item.value, args.userInput.expenses.amount.value);

              // We can't access to result of updateOne() in the next method(.then())
              // so returned result will look wrong,
              // But, in Database evryhing is OK.
              User.updateOne({
                _id: args._id,
                balance: {
                  $elemMatch: {
                    currencyName: args.userInput.expenses.amount.currencyName,
                    type: args.userInput.expenses.amount.type
                  }
                }
              }, {
                $set: {
                  'balance.$.value': item.value - args.userInput.expenses.amount.value
                }
              },
                (err) => { console.log(err) }
              )
            }
          })
          /*
          if (!isMathedExpenseExist) {
    
            updateUser.balance.push({
              value: args.userInput.expenses.amount.value,
              currencyName: args.userInput.expenses.amount.currencyName,
              type: args.userInput.expenses.amount.type
            })
          }
          */
        }

        if (args.userInput.expenseCategorys) {
          console.log("::::args.userInput.expenseCategorys.categoryName:::", args.userInput.expenseCategorys.categoryName);
          updateUser.expenseCategorys.push({
            categoryName: args.userInput.expenseCategorys.categoryName
          })
        }

        if (args.userInput.incomeCategorys) {
          updateUser.incomeCategorys.push({
            categoryName: args.userInput.incomeCategorys.categoryName
          })
        }

        return updateUser.save();
      })
      .then(result => {

        //console.log(result);
        return { ...result._doc, password: null, _id: result.id }
      })
      .catch(err => {
        throw err;
      })
  },

  editUser: (args) => {
    console.log("::::::::::args:::::::::::", args);
    return User.findOne({ _id: args._id })
      .then(user => {
        console.log("::::::::::user::::::::;", user);

        if (args.userEdit.oldExpenseCategorys) {

          let targetIndex = user.expenseCategorys.findIndex(item => item.categoryName == args.userEdit.oldExpenseCategorys.categoryName)
          user.expenseCategorys[targetIndex].categoryName = args.userEdit.newExpenseCategorys.categoryName;

          // save changes on database
          User.updateOne({
            _id: args._id,
            expenseCategorys: {
              $elemMatch: {
                categoryName: args.userEdit.oldExpenseCategorys.categoryName
              }
            }
          }, {
            $set: {
              'expenseCategorys.$.categoryName': args.userEdit.newExpenseCategorys.categoryName
            }
          },
            (err) => { console.log(err) }
          )
        }

        if (args.userEdit.oldIncomeCategorys) {

          let targetIndex = user.incomeCategorys.findIndex(item => item.categoryName == args.userEdit.oldIncomeCategorys.categoryName)
          user.incomeCategorys[targetIndex].categoryName = args.userEdit.newIncomeCategorys.categoryName;

          // save changes on database
          User.updateOne({
            _id: args._id,
            incomeCategorys: {
              $elemMatch: {
                categoryName: args.userEdit.oldIncomeCategorys.categoryName
              }
            }
          }, {
            $set: {
              'incomeCategorys.$.categoryName': args.userEdit.newIncomeCategorys.categoryName
            }
          },
            (err) => { console.log(err) }
          )
        }

        return user.save();
      })
      .catch(err => { throw err })
  },

  removeUserItem: (args) => {
    return User.findOne({ _id: args._id })
      .then(user => {

        let newExpenseCategorys = user.expenseCategorys;
        let newIncomeCategorys = user.incomeCategorys;

        if (args.removeItem.expenseCategory) {
          newExpenseCategorys = user.expenseCategorys.filter(item => item.categoryName !== args.removeItem.expenseCategory.categoryName)

          User.updateOne({
            _id: args._id,
          }, {
            $pull: {
              expenseCategorys: { categoryName: args.removeItem.expenseCategory.categoryName }
            }
          },
            (err) => { console.log(err) }
          )
        }

        if (args.removeItem.incomeCategory) {
          newIncomeCategorys = user.incomeCategorys.filter(item => item.categoryName !== args.removeItem.incomeCategory.categoryName)

          User.updateOne({
            _id: args._id,
          }, {
            $pull: {
              incomeCategorys: { categoryName: args.removeItem.incomeCategory.categoryName }
            }
          },
            (err) => { console.log(err) }
          )
        }

        user.expenseCategorys = newExpenseCategorys;
        user.incomeCategorys = newIncomeCategorys;

        return user.save();
      })
      .catch(err => { throw err })
  }
};

var app = express();

//app.use(bodyParser.json())

app.use(cors());


/*
app.use((req , res , next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTION');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if(req.method === 'OPTION'){
    return res.sendStatus(200);
  }
  next();
})

*/

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


mongoose.connect('mongodb+srv://admin:Ali1234@cluster0.ig7m8.mongodb.net/testdb?retryWrites=true&w=majority'
).then(() => {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Running a GraphQL API server at port ${port}`));
}).catch(err => {
  console.log(err);
})


