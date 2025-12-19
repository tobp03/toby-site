---
title: "Support Vector Machine"
date: "2025-12-09"
updated: "2025-12-19T20:51:00+00:00"
subjects: ['data science']
topics: ['Statistical Learning', 'Machine Learning']
---

## Data setup

We assume we have a dataset

$$
\{(x_i,y_i)\}_{i=1}^{n}, \quad x_i\in\mathbb{R}^p,y_i\in\{-1,+1\}
$$

Each $x_i$ is the feature vector, and each $y_i$ class labels tells us which side of the boundary it belongs to.

## Goal of SVM

In SVM, we have upper and lower decision boundary which is supported by the closest support vector.

The goal of SVM is to maximize the margin between lower and upper boundary. In other words, we are trying to separate each class as best as possible. Consider the following plot:

![image](/images/Support%20Vector%20Machine/image.png)

The hyperplane should be located right between the upper and lower boundary to separate each class in the best way possible. If the hyperplane lies to close to the +1 class, then if we have a new observation, it is more likely for the +1 class to be misclassified as -1 class.

## Hard Margin SVM

If the data can be separated with no mistakes, SVM tries to find a hyperplane

$$
w^\intercal x+b=0
$$

that maximizes the margin or the distance between boundary and the support vectors.

The optimization problem is:

$$
\min_{w,b}\frac{1}{2}||w||^2
$$

subject to

$$
y_i(w^\intercal x_i + b)\ge 1, \quad i=1,\dots,n.
$$

The constraint means that every point is correctly classified and lies outside the margin. Furthermore, minimizing $||w||^2$ make the margin $\frac{2}{||w||}$ as large as possible.

## Soft Margin SVM

REal data often cannot be perfectly separated. So we introduce a slack variable $\xi_i\ge0$ to allow data points to be misclassified:

$$
y_i(w^\intercal x_i+b)\ge1-\xi_i.
$$

The new optimization problem is:

$$
\min_{w,b,\xi} \frac{1}{2}||w||^2 + C\sum_i^n \xi_i
$$

where

- $C>0$ controls the trade-off:
  - Large $C$: fewer mistake (tighter fit)
  - small $C:$ larger margin, more tolerance for errors
-  $\frac{1}{2}||w||^2$ are the regularization term in SVM, identical to L2 regularization which encourages large margin and prevent overfitting.
-  $C\sum_{i=1}^n \xi_i$ measures how much a point violates the margin.
## Kernel Trick

Sometimes the data is not linearly separable in the original space. The kernel trick is an alternative to transforming the data to a higher dimension which is very expensive in compute power. The kernel trick implicitly maps the data to a higher dimensional space:

$$
K(x_i,x_j) = \phi(x_i)^\intercal \phi(x_j)
$$

Common kernels:

- RBF (Gaussian):
$$
K(x_i,x_j)=\exp(-\frac{||x_i-x_j||^2}{2\sigma^2})
$$

- Polynomial 
$$
K(x_i,x_j)=\exp(x_i^\intercal x_j + 1)^d
$$

If we have 100 observations, then it will compute a $100\times100 $ kernel matrix called gram matrix:

$$
K(i,j)=K(x_i,x_j)
$$

The matrix contains similarity between every pair of data points. Then, instead of using of the original features, SVM solves the optimization problem only using kernel similarity.





We have the cost function

$$
J(\theta)=C\sum_{i=1}^{n}y_i\mathrm{cost}_1\left(\theta^\intercal x_i \right) + (1-y_i)\mathrm{cost}_0\left(\theta^\intercal x_i\right) + \frac{1}{2}\sum_{j=1}^p \theta_j^2
$$

Let’s separate this cost function into two parts:

$$
J(\theta)= C\cdot A(\theta)+B(\theta)
$$

where 

- $A(\theta)$ is the sum of misclassification cost
- $B(\theta)$ is the regularization term
- $C$ controls how important the data error is
Suppose that $C=100,000$. Then a small value of $A(\theta)$ becomes very huge.

For example, if $A(\theta)=0.01$ then $CA(\theta)=1000$.

This will dominate the cost function completely. So to minimize $J$, the optimizer must make:

$$
A(\theta)=0
$$

Otherwise, $J$ is extremely large. 

Hence, this reduce our cost function to:

$$
J(\theta)=C\cdot0+\frac{1}{2}\sum_j^p \theta_j^2
$$

|  |  |  |
| --- | --- | --- |
| Test | 123123 | 123123 |
| $x+2$ | $23$ | 123123 |
| asad | asdasd | asdasd |

asd

asd



> Test 123


Thanks G



