---
title: "Logistic Regression"
date: "2025-12-09"
updated: "2025-12-19T13:50:00+00:00"
subjects: ['data science']
topics: ['Statistical Learning']
---

## Data Definition

We consider a dataset with 

$$
X\in \mathbb{R}^{n\times p}
$$

where:

- $n$ is the number of observations
- $p$ is the number of features
Each row of $X$ corresponds to one data point. We denote the $i$-th observation as 

$$
(x_i,y_i)
$$

where:

- $x_i \in \mathbb{R}^p$ is the feature vector
- $y_i\in\{0,1\} $ is the binary class label for that observation.
Thus our dataset it:

$$
\{(x_i,y_i)\}_{i=1}^n
$$

## Logistic Regression Model

In logistic regression, we model the probability that an observation belongs to the positive class ($y=1$) using logistic (sigmoid) function.

First compute the linear features (it doesn’t always have to be linear)

$$
\begin{align*}
{z}&= \theta^\intercal{x}\\

\end{align*}
$$

where $\theta\in \mathbb{R}^p$ is the weight vector.

Then the hypothesis logistic function is defined as:

$$
h_\theta(x)=g({z})=\frac{1}{1+e^{-{z}}}
$$

The output $h_\theta(x)$ represents the probability that the input $x$ belongs to class $y$.

$$
h_\theta(x)=P(y=1|x;\theta)
$$

<aside>

Terminology!!

Hypothesis is any function that maps input $x$ to predictions.

</aside>

## Decision boundary

The output of the logistic regression model,

$$
h_\theta(x)=\frac{1}{1+e^{-{z}}}
$$

is a probability in the range $(0,1)$. For binary classification, we convert this probability into a class label using threshold with the following rule

$$
h_\theta(x) \ge0.5 \to \hat{y}=1\\
h_\theta(x) <0.5 \to \hat{y}=0\\
$$

since the sigmoid function satisfies

$$
g(z)\ge0.5 \leftrightarrow z\ge0,
$$

This is equivalent to checking the sign of the linear predictor

$$
\theta^\intercal x\ge0 \rightarrow\hat{y}=1, \quad \theta^\intercal x<0 \rightarrow \hat{y}=0.
$$

## Cost Function

Since we will be doing binary classification, we use the following cost function

$$
J(\theta) = -\frac{1}{n}\sum\left[y_i \log(h_\theta(x_i)) + (1-y_i)\log(1-h_\theta(x_i))\right].
$$

That is for each iteration:

- Case $y_i=1$:
  -  $h_\theta(x)=0 \rightarrow \infin$
  -  $h_\theta(x)=1 \rightarrow 0 $
- Case $y_i=0$
  -  $h_\theta(x)=0 \rightarrow 0$
  -  $h_\theta(x)=1 \rightarrow \infin$
It means that the cost function for a pair of $(x_i,y_i)$ will be small if they are close to each other, but very big if they are further away.

In matrix form:

$$
\begin{align*}
\mathbf{h} &= g(X\theta)
\\J(\theta)&=\frac{1}{n}(-\mathbf{y}^\intercal \log(\mathbf h)-(1-\mathbf y)^\intercal\log(1-\mathbf h))
\end{align*}
$$

where $X\theta$ gives $n\times1$ vector and sigmoid function $g$ is applied element-wise.

# Gradient descent

Given the cost function, we will update our parameters so that each iteration decreases the cost. For the $j$-th component of $\theta \in \mathbb{R}^p$, the rule is:

$$
\theta_j^*=\theta_j - \alpha\frac{\partial}{\partial \theta_j}J(\theta).
$$

We can work out the derivative with calculus to get:

$$
\theta_j^*=\theta_j - \frac{\alpha}{n} \sum_{i=1}^n\left(h_\theta(x_i)-y_i\right)x_{ij}.
$$

In matrix form:

$$
\theta^*=\theta - \frac{\alpha}{n} X^T\left(g(X\theta)-\mathbf{y}\right)
$$



<aside>

Proof for $\theta_j$

$$
\begin{align*}
\frac{\partial}{\partial \theta_j}J(\theta) &= \frac{\partial}{\partial \theta_j} \frac{-1}{n}\sum\left[y_i \log(h_\theta(x_i)) + (1-y_i)\log(1-h_\theta(x_i))\right] \\
&= -\frac{1}{n}\sum\left[y_i\frac{\partial}{\partial \theta_j} \log(h_\theta(x_i)) + (1-y_i)\frac{\partial}{\partial \theta_j}\log(1-h_\theta(x_i))\right]

\end{align*}
$$

First solve $\frac{\partial}{\partial \theta_j} \log(h_\theta(x_i))$:

With:

$$
\begin{align*}
h_\theta(x_i) &= g(\theta^\top x_i)
= \frac{1}{1 + e^{-\theta^\top x_i}}, \quad \log(h_\theta(x_i))
&= -\log\!\left(1 + e^{-\theta^\top x_i}\right)\\




\end{align*}

$$

$$
\begin{align*}
\frac{\partial}{\partial \theta_j} \log(h_\theta(x_i))
&= \frac{\partial}{\partial \theta_j}
\left[ -\log\left(1 + e^{-\theta^\top x_i}\right) \right] \\[6pt]
&= -\frac{1}{1 + e^{-\theta^\top x_i}}
\cdot \frac{\partial}{\partial \theta_j}\left(e^{-\theta^\top x_i}\right) \\[6pt]
&= -\frac{1}{1 + e^{-\theta^\top x_i}}
\cdot \left( e^{-\theta^\top x_i} \cdot
\frac{\partial}{\partial \theta_j}(-\theta^\top x_i) \right) \\[6pt]
&= -\frac{1}{1 + e^{-\theta^\top x_i}}
\cdot \left( e^{-\theta^\top x_i} \cdot (-x_{ij}) \right)
\end{align*}
$$

Using


$$
h_\theta(x_i) = \frac{1}{1 + e^{-\theta^\top x_i}}, \qquad
1 - h_\theta(x_i) = \frac{e^{-\theta^\top x_i}}{1 + e^{-\theta^\top x_i}},

$$

we simplify:

$$

\frac{\partial}{\partial \theta_j} \log(h_\theta(x_i))
= (1 - h_\theta(x_i))\, x_{ij}.
$$

Now compute the derivative of $\log(1 - h_\theta(x_i)).$

$$
\begin{align*}\log(1 - h_\theta(x_i))&= \log\left( \frac{e^{-\theta^\top x_i}}{1 + e^{-\theta^\top x_i}} \right) \\&= -\theta^\top x_i - \log(1 + e^{-\theta^\top x_i}).\end{align*}
$$

$$
\begin{align*}\frac{\partial}{\partial \theta_j}\log(1 - h_\theta(x_i))&= -x_{ij} - \frac{1}{1 + e^{-\theta^\top x_i}}      \cdot e^{-\theta^\top x_i} \cdot (-x_{ij}) \\&= -x_{ij} + (1 - h_\theta(x_i))x_{ij} \\&= -h_\theta(x_i)x_{ij}.\end{align*}
$$

Substitute both derivative back to the original expression:

$$
\begin{align*}\frac{\partial}{\partial \theta_j}J(\theta)&= -\frac{1}{n}\sum_{i=1}^n \left[ y_i (1 - h_\theta(x_i))x_{ij}     + (1-y_i)(-h_\theta(x_i)x_{ij}) \right] \\&= -\frac{1}{n}\sum_{i=1}^n \left[ y_i x_{ij} - y_i h_\theta(x_i)x_{ij}     - h_\theta(x_i)x_{ij} + y_i h_\theta(x_i)x_{ij} \right] \\&= -\frac{1}{n}\sum_{i=1}^n \left[ y_i x_{ij} - h_\theta(x_i)x_{ij} \right] \\&= \frac{1}{n}\sum_{i=1}^n \left( h_\theta(x_i) - y_i \right)x_{ij}.\end{align*}
$$

</aside>





