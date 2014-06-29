#https://en.wikibooks.org/wiki/Data_Mining_Algorithms_In_R/Frequent_Pattern_Mining/The_Apriori_Algorithm

#Clear all variables in global environment
rm(list = setdiff(ls(), lsf.str()));
setwd('~/Sites/Mobile-CRM/r');

library("arules");
library("reshape");

source("mysql.R");
dbSendQuery(db, "truncate table tbl_sold_rules");

#Getting sold data from DB
rs = dbSendQuery(db, "call getSoldDataBreakup()");

sold_data = fetch(rs, n=-1)
sold_data = sold_data[, -1];

#Categorizing columns
for (i in names(sold_data)) { 
  sold_data[, i]  <- factor(sold_data[, i]);
} 

#Getting base rules
transactions <- as(sold_data, "transactions");
rules = apriori(transactions, parameter=list(support=0.00000001, confidence=0.05));

#Generating filtering conditions
cols = colnames(sold_data);
cond1 = NULL;
cond2 = NULL;

for(i in 1:length(sold_data)){
  cond1 = c(cond1, paste(cols[i], "=1", sep=""));  
  cond2 = c(cond2, paste(cols[i], "=0", sep=""));  
}

#Getting final results
rules_subset <- sort(
  subset(rules, 
         #(lhs %in% cond1) &
           !(lhs %in% cond2) &
           (rhs %in% cond1)
  ),
  decreasing = TRUE,
  by = "support"
);

inspect(rules_subset);

rules_subset <- as(rules_subset, "data.frame");
rownames(rules_subset) <- 1:nrow(rules_subset);
rules_subset <- as(rules_subset, "matrix");

#Cleaning up & splitting LHS & RHS rules
y <- rules_subset[, 1];

y <- mapply(gsub, "\\{", "", y);
y <- mapply(gsub, "\\}", "", y);
y <- mapply(gsub, "=1", "", y);

y <- colsplit(y, split=" => ", c("lhs", "rhs"));

rules_subset <- cbind(y, rules_subset[, -1]);

#Writing to database
dbWriteTable(db, "tbl_sold_rules", rules_subset, append = T, row.names = F);
dbDisconnect(db);