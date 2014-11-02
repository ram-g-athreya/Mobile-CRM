#Clear all variables in global environment
rm(list = setdiff(ls(), lsf.str()));
setwd('/Users/ramathreya/Sites/Mobile-CRM/r');

library("Matrix");
library("arules");
library("reshape");
library("arulesViz");
library("arulesSequences");

transactions <- read_baskets(con = 'sequence.txt', info = c("sequenceID","eventID","SIZE"))
as(transactions, 'data.frame');
s1 <- cspade(transactions, parameter = list(support = 0.00001), control = list(verbose = TRUE))
s1 <- as(s1, 'data.frame')

attach(s1);
rules <- s1[order(-support), ]

#rules <- s1[order(s1$support)]