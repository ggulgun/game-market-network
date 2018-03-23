@param {org.game.model.order} transact


function transact(orders)
{
  console.log("Game Market Order");
  
  var initial_customer_balance=orders.cust.account_balance;
  
  var totalprice=0;
  
  var i=0;
  
  while(orders.cart_items.game_items[i]!=null)
  {
    gametotalprice = orders.cart_items.game_items[i].cost*orders.cart_items.game_items[i].quantity;
	totalprice = totalprice + gametotalprice;
    i++;
  }
  if(initial_customer_balance-(totalprice)<0)
  {
    throw new Error('The customer does not have enough balance');
  }
  else{
  orders.markt.account_balance=orders.markt.account_balance+totalprice;
  orders.cust.account_balance=initial_customer_balance-totalprice;
  }
  
  var SH="org.game.model";
  var factory = getFactory();
   
  var receiptoftransfer = factory.newResource(SH, 'receipt', orders.order_id);
  receiptoftransfer.cust=factory.newRelationship(SH,'customer',orders.cust.cust_id);
  receiptoftransfer.cart_items=factory.newRelationship(SH,'cart',orders.cart_items.order_id);
  receiptoftransfer.markt=factory.newRelationship(SH,'market',orders.markt.owner);
  receiptoftransfer.total=total;
  
  return getParticipantRegistry('org.game.model.customer')
        .then(function (customer) {
            
            return customer.update(orders.cust);
        })
 		 .then(function () {
            return getParticipantRegistry('org.game.model.market');
        })
      .then(function(market){
      return market.update(orders.rest);
    })
  		.then(function () {
      return getAssetRegistry('org.game.model.receipt');
    })
  		.then(function (receiptRegistry){
      return receiptRegistry.addAll([receiptoftransfer]);
    });    
}
