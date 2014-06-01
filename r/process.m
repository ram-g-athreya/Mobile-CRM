clear ; close all; clc

data = csvread('in.csv');
X = data(2:end,2:end);

% Settings for running K-Means
K = 3; % 3 Centroids
max_iters = 10;

% For consistency, here we set centroids to specific values
% but in practice you want to generate them automatically, such as by
% settings them to be random examples (as can be seen in
% kMeansInitCentroids).

m = max(K, size(X, 2));
cols = size(X, 2);
initial_centroids = magic(m)(1:K, 1:cols);

% Run K-Means algorithm. The 'true' at the end tells our function to plot
% the progress of K-Means
[centroids, idx] = runkMeans(X, initial_centroids, max_iters, true);
fprintf('\nK-Means Done.\n\n');

centroids
