---
title: "Canonical Correlation Analysis (CCA)"
date: "2025-11-12"
updated: "2025-12-19T13:51:00+00:00"
subjects: ['data science']
topics: ['Dimensionality Reduction']
---

# 1. CCA setup

Let 

$$
X\in\mathbb{R}^r, \quad Y\in\mathbb{R}^s
$$

be two random vectors - possibly representing two different sets of variables. Their joint expectation and covariance structure is:

$$
E\begin{pmatrix}X\\ Y\end{pmatrix}=\begin{pmatrix}\mu_X\\ \mu_Y\end{pmatrix}, \quad \mathrm{Var}\begin{pmatrix}X\\ Y\end{pmatrix}=\begin{pmatrix}\Sigma_{XX} & \Sigma_{XY} \\ \Sigma_{YX} & \Sigma_{YY}\end{pmatrix}
$$

<aside>

💡 where

- $\Sigma_{XX}=\mathrm{Var}(X)$ is the covariance matrix of $X$ $(r\times r)$
- $\Sigma_{YY}=\mathrm{Var}(Y)$ is the covariance matrix of $Y$ $(s\times s)$
- $\Sigma_{XY}=\mathrm{Cov}(X,Y)=E\left[(X-\mu_X)(Y-\mu_Y)^\intercal\right]$ is the cross covariance $(r\times s)$
- $\Sigma_{XY} = \Sigma_{YX}^\intercal$
</aside>

# 2. The goal of CCA

Find linear combinations of $X$ and $Y$:

$$
\xi=g^\intercal X, \quad \eta=h^\intercal Y
$$

where $g\in \mathbb{R}^r, \quad h\in \mathbb{R}^s$ are weight vectors.  Such that their correlation is maximum.

$$
\mathrm{Corr}(g^\intercal X,h^\intercal Y)=\frac{\mathrm{Cov}(g^\intercal X,h^\intercal Y)}{\sqrt{\mathrm{Var}(g^\intercal X)\mathrm{Var}(h^\intercal Y)}}
$$

Substitute the covariance terms:

$$
\begin{align*}
\mathrm{Cov}(g^\intercal X,h^\intercal Y)=g^\intercal\Sigma_{XY}h \\

\mathrm{Var}(g^\intercal X)=g^\intercal \Sigma_{XX} g\\

\mathrm{Var}(h^\intercal)=h^\intercal\Sigma_{YY} h

\end{align*}
$$

Hence:

$$
\fbox{$p(g,h)=\frac{g^\intercal \Sigma_{XX} h}{\sqrt{(g^\intercal \Sigma_{XX} g)(h^\intercal\Sigma_{YY} h)}}$}
$$

We want:

$$
\max_{g,h} \rho(g,h)=\frac{g^\intercal \Sigma_{XX} h}{\sqrt{(g^\intercal \Sigma_{XX} g)(h^\intercal\Sigma_{YY} h)}}
$$

Subject to :

$$
\mathrm{Var}(\xi)=g^\intercal \Sigma_{XX} g=1, \quad

\mathrm{Var}(\eta)=h^\intercal\Sigma_{YY} h=1
$$

To ensure that it has the same scale (same “energy” or “length”).

## 3. Canonical Variates

These projections reduce each multivariate variable to a single scalar representing a direction in a feature space.

Canonical Correlation Analysis finds up to 

$$
t=\min(r,s)
$$

pairs of new variables:

$$
(\xi_1,\eta_1),(\xi_2,\eta_2),\dots,(\xi_t,\eta_t)
$$

where:

$$
\xi_j=g_j^\intercal X= g_{1j}X_1 + \dots +g_{rj}X_r \\ \eta_j=h_j^\intercal Y= h_{1j}Y_1+\dots+h_{sj}Y_s
$$

- $r$ corresponds to the size of $X$
- $s$ corresponds to the size of $Y$
- $j$ corresponds to the $j$-th pair of the canonical variates $(\xi_j,\eta_k)$
- So $g_{1j}$ means the weight between the $X_1$ and the canonical pair $j$.
Each pair has its own canonical correlation:

$$
p_j=\mathrm{corr}(\xi_j,\eta_j)=\frac{g_j^\intercal \Sigma_{XX} h_j}{\sqrt{(g_j^\intercal \Sigma_{XX} g_j)(h_j^\intercal\Sigma_{YY} h_j)}}
$$

Orthogonality conditions:

- $\xi_j$ is uncorrelated with all previous $\xi_k,$$k<j$:  $\quad\mathrm{Cov}(\xi_j,\xi_k)=0$
- $\eta_J$ is uncorrelated with all previous $\eta_j$, $k<j$:$\quad\mathrm{Cov}(\eta_j,\eta_k)=0$
## 4. Computing the coefficients

From the population matrices:

1. Compute
$$
R= \Sigma^{-1/2}_{YY}\Sigma_{YX}\Sigma_{XX}\Sigma_{XY}\Sigma^{-1/2}_{YY}
$$

<aside>

</aside>

1. Find its eigenvalues $\lambda_1^2\ge\dots\lambda_t^2$ and corresponding eigenvectors $q_1,\dots,q_t$
1. Then:
$$
h_j=\Sigma_{YY}^{-1/2}q_j \\
g_j = \Sigma^{-1}_{XX}\Sigma_{XY}\Sigma^{-1/2}_{YY}q_j
$$

1. The canonical correlations are the square roots of the eigenvalues:
$$
\rho_j=\lambda_j
$$

## 5. Variance-Covariance properties

For the $j$-th pair of canonical variates:

$$
\mathrm{Var}(\xi_j)=g_j^\intercal\Sigma_{XX}g_j=\lambda_j^2, \quad \mathrm{Var}(\eta_j)=h_j^\intercal\Sigma_{YY}h_j=\lambda_j^2,
$$

$$
\mathrm{Cov}(\xi_j,\eta_j)=g_j^\intercal\Sigma_{XY}h_j=\lambda^2
$$

and 

$$
\mathrm{Cor}(\xi_j,\eta_j)=\lambda_j
$$

## 6. Sample Canonical Variates

Given $n$ paired observations : $(X_1,Y_1),\dots,(X_n,Y_n)$

Compute the sample mean and deviation:

$$
\delta X_i = X_i - \bar{X}, \quad \delta Y_i=Y_i-\bar{Y}
$$

<aside>

Here $\delta$ means take each observation and subtract its mean. (Not an operator). $\delta X_i $ is the centered version of the vector $X_i$.

</aside>

Then estimate the covariance matrix:

$$
\hat{\Sigma}_{XX}=\frac{1}{n}\sum_i\delta X_i\delta X_i^\intercal, \quad \hat{\Sigma}_{YY}=\frac{1}{n}\delta Y_i \delta Y_i^\intercal, \quad \hat{\Sigma}_{XY}=\frac{1}{n} \sum_i\delta X_i \delta Y_i^{\intercal}
$$

Use these form:

$$
\hat{R}= \hat{\Sigma}^{-1/2}_{YY}\hat{\Sigma}_{YX}\hat{\Sigma}_{XX}\hat{\Sigma}_{XY}\hat{\Sigma}^{-1/2}_{YY}
$$

To compute eigenvalues $\hat{\lambda}_j^2$ and eigenvectors $\hat{q}_j.$

Then:

$$
\hat{h}_j=\hat{\Sigma}_{YY}^{-1/2}q_j, \quad \hat{g}_j = \hat{\Sigma}_{XX}^{-1} \hat{\Sigma}_{XY} \hat{\Sigma}_{YY}^{-1/2}\hat{q}_j
$$

And the sample sample canonical variates:

$$
\hat{\xi}_{ij}=\hat{g}_j^\intercal X_i, \quad \hat{\eta}_{ij}=\hat{h}_j^\intercal Y_i
$$

with sample canonical correlation 

$$
\hat{\rho}_j=\hat{\lambda}_j. \text{(NOT EIGEN VALUES)}
$$

Imagine two set of variables on the same 5 people.

## Step 1: Define the data matrix

$$
X = \begin{bmatrix}
80 & 75 \\ 90 & 88 \\ 70 & 72 \\ 85 & 83 \\ 60 & 65
\end{bmatrix}, \quad Y = \begin{bmatrix}
78 & 82 \\ 84 & 89 \\ 65 & 70 \\ 80 & 84 \\ 55 & 60
\end{bmatrix}
$$

Here $X$ has 2 varibles, and $Y$ has 2 variables. Then, $y=\min(2,2)=2$ canonical pairs possible.

## Step 2: Calculate covariance matrices

With the formula:

$$
\Sigma_{XX}=\frac{1}{n-1}X_c^\intercal X_c
$$

We get

$$
\Sigma_{XX} \approx \begin{bmatrix}
145  & 106 \\ 106 &  82.3
\end{bmatrix}, \quad \Sigma_{YY} \approx \begin{bmatrix}
145.3  & 142 \\ 142 &  139
\end{bmatrix}, \quad \Sigma_{XY} \approx \begin{bmatrix}
144  & 141.25 \\ 141.25 &  100.75
\end{bmatrix}
$$

## Step 3: Calculate eigenvalue and eigenvector

$$
\begin{align*}R &= \Sigma^{-1/2}_{YY}\Sigma_{YX}\Sigma_{XX}\Sigma_{XY}\Sigma^{-1/2}_{YY} \\

&= \begin{bmatrix} 0.7671 & 0.246 \\ 0.246 & 0.7402 \end{bmatrix}
\end{align*}
$$

Now calculate $\det (R - \Lambda I)=0$ numerically, gives:

- Eigenvalues ($Rq_j = \lambda^2_jq_j$)
  $\lambda_1 \approx 0.999984, \lambda_2 \approx 0.50727$

- Canonical correlations, remember that $\lambda^2_1 \ge \dots\ge\lambda^2_s$ are eigenvalues of R:
  $\rho_1 = \sqrt \lambda_1 \approx 0.9999, \quad \rho_2 = \sqrt \lambda_2 \approx 0.712$

Eigen vectors $q_j$, ordered:

$$
q_1 \approx\begin{bmatrix} -0.7261 \\ -0.6875 \end{bmatrix}, \quad q_2 \approx\begin{bmatrix} 0.6875 \\ -0.7261 \end{bmatrix}
$$



## Step 4: Canonical weight vectors (coefficients)

We want to find the vector $g_j, h_j$ such that the correlation between 

$$
\xi_j = g_j^\intercal X, \quad \eta_j = h_j^\intercal Y
$$

We find $g_j$ and $h_j$ from using this formula:

$$
h_j=\Sigma_{YY}^{-1/2}q_j \\
g_j = \Sigma^{-1}_{XX}\Sigma_{XY}\Sigma^{-1/2}_{YY}q_j
$$

We get:

$$
g_1 = \begin{bmatrix} 0.9103 \\ -0.4139 
\end{bmatrix}, \quad g_2 = \begin{bmatrix} -0.5781 \\ -0.8160 
\end{bmatrix} \\
h_1 = \begin{bmatrix} 0.9954 \\ 0.00961 
\end{bmatrix}, \quad h_2 = \begin{bmatrix} -0.06990 \\ 0.7151
\end{bmatrix}
$$

And the centered data

$$
X_c = \begin{bmatrix}
3 & -1.6 \\ 13 & 11.4 \\ -7& -4.6 \\ 8 & 836.4\\ -17& -11.6
\end{bmatrix}, \quad Y = \begin{bmatrix}
5.6 & 5 \\ 11.6 & 12\\ -7.4 & -7 \\ 7.6 & 7 \\ -17.4 & -17
\end{bmatrix}
$$

### The first canonical pair $(\xi_1,\eta_1)$

For each student $i$:

$$
\xi_{1,i}=0.9103X^c_{1i} - 0.4139X^c_{2i}\\ 

\eta_{1i} = 0.9954Y^c_{1i} + 0.0961(Y^c_{2i}) 
$$

Computed values: 

These have correlation $\approx 0.9999$

How to read the pair $(\xi_1,\eta_1)$?

- $\xi$ is a linear combination of math and physics.
- $\eta$ is linear combination of English and History.
- If we see the computed values, the overall science performance vs overall humanities performance move perfectly together ($\mathrm{Corr \approx 1}$)
