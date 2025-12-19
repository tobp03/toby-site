---
title: "Exploratory Factor Analysis (EFA) "
date: "2025-11-04"
updated: "2025-12-19T16:41:00+00:00"
subjects: ['data science']
topics: ['Dimensionality Reduction']
---

<aside>

🔗 Related

- Rotation methods (Varimax, Quartimax, Oblimin)
- Factor scores estimation (Bartlett, regression)
- Likelihood ratio tests for number of factors
- Confirmatory Factor Analysis (CFA)
- Principal Component Analysis (PCA) comparison
</aside>



<aside>

🧩 Key points

- $X=μ+Λf+e$ — population model
- Covariance structure: $\Sigma = \Lambda\Lambda^\top + \Psi$
- $h_i^2$: communality (shared variance); $\psi_i$: uniqueness
- Factor loadings are not unique → rotation gives equivalent models
- Scaling data ($CX$) keeps factor model valid (scale-invariant property)
- Degrees of freedom: $d = \frac{p(p+1)}{2} - [pk + p - \frac{k(k-1)}{2}]$
- Two estimation families:
  - Non–scale-invariant: PFA, PCF (based on least squares)
  - Scale-invariant: MLFA (based on likelihood)
- MLFA: assumes multivariate normality; allows formal tests (e.g. χ² test)
- Iterative estimation: alternate updates of $\Lambda$ and $\Psi$


</aside>

<aside>

Overview

Exploratory Factor Analysis (EFA) explains correlations between observed variables through a smaller number of unobserved common factors. It assumes the covariance structure$ \Sigma = Λ Λ^\intercal + Ψ$  , where $Λ$  represents factor loadings (shared variance) and $Ψ$ represents unique variances (specific to each variable). The main goal is to estimate  $Λ$ and $Ψ$ using methods like Principal Factor Analysis, Principal Component Factoring, or Maximum Likelihood Factor Analysis.

</aside>

Exploratory factor analysis (EFA): A statistical technique to explain correlations among observed variables (the dataset) through linear combinations of fewer latent or unobserved factors.



# EFA Population Model 

## 1. Components and Assumptions

The $k$-factor model is formulated around several key vectors and matrices:

1. Observed Variables $X = (X_1,\dots,X_p)^\intercal$ is a $p$-dimensional random vector with mean vector $\mathbf{\mu}$ and covariance matrix $\Sigma$.
1. Common Factors $f=(f_1,\dots,f_k)^\intercal$ is a $k$-dimensional vector (also random variables) that represents with zero mean and components are uncorrelated with unit 
1. Individual errors $\mathbf{e}=(e_1,\dots,e_p)^\intercal$ is a $p$-dimensional vector represents the unique part of each observed variable not explained by the common factor. It has zero mean $E(e)=0$ and components are uncorrelated uncorrelated with each other. The variance of  $e_j$ is denoted , resulting in a diagonal covariance matrix  $\Psi=Var(e)$.
The $k$-factor model expresses the observed variable $X$ relative to its mean $\mu$ as a linear combination of these factor vectors.

In component form:

$$
X_i-\mu_i = \lambda_{i1}f_1 + \lambda_{i2}f_2+\cdots+\lambda_{ik}f_{k}+e_i
$$

In matrix form:

$$
X-\mu=\Lambda f + \mathbf{e},
$$

where the following assumptions hold:

$$
E(f)=0, E(e)=0, E(ff^\intercal) = I_k, E(fe^\intercal)=0,Var(\mathbf{e})=\Psi,
$$

where $\Psi$ is a diagonal matrix, and $\Lambda$ is loading matrix. 

## 2. Derivation of the Population Covariance Structure

If the $k$-factor model holds, then the population matrix can be derived:

$$
\begin{align}
\Sigma 	&= Var(X) \\ 
	&= E\left[(X-\mu)(X-\mu)^\intercal\right] \\
	&= E\left[(\Lambda f+e)(\Lambda f+e)^\intercal\right] \text{}\\ 
	&= E\left[\Lambda f f^\intercal\Lambda^\intercal + \Lambda f e^\intercal + ef^\intercal\Lambda^\intercal+ee^\intercal \right] \\ 
&= \Lambda E\left[ff^\intercal\right]\Lambda^\intercal + \Lambda E\left[fe^\intercal\right] + E\left[ef^\intercal\right]\Lambda^\intercal + E\left[ee^\intercal\right] \\ 
	&= \Lambda \Lambda^\intercal + \Lambda 0 + 0\Lambda^\intercal + \Psi \\ 
&=   \Lambda \Lambda^\intercal  + \Psi
\end{align}
$$

<aside>

💡 Interpretation: $\Lambda\Lambda^\intercal$ is the covariance explained by the common factors ($f$). While $\Psi$ is the covariance of uniqueness.

</aside>

### Properties of $\Sigma - \Psi$

From the factor model result $\Sigma - \Psi = \Lambda\Lambda^\intercal$, the matrix $\Sigma - \Psi$ has the following properties:

1. Positive Semidefinite (PSD)
  Since any matrix of the form $A A^\intercal$ is positive semidefinite,

  $x^\intercal(\Sigma - \Psi)x = x^\intercal\Lambda\Lambda^\intercal x = \|\Lambda^\intercal x\|^2 \ge 0$, for all $x \in \mathbb{R}^p$

  Thus, $\Sigma - \Psi$ is positive semidefinite.

1. Rank $k$
  The rank of $\Lambda\Lambda^\intercal$ equals the number of linearly independent columns of $\Lambda$, which is at most $k$ (since $\Lambda$ is $p \times k$). 

  Therefore, $\operatorname{rank}(\Sigma - \Psi) = k$.

## 3. Communalities and Uniqueness in Factor Model

The $k$-factor model assumes : $\Sigma = \Lambda\Lambda^\intercal + \Psi$, where

$$
\Sigma =\begin{pmatrix}\sigma_{11} & \sigma_{12} & \cdots & \sigma_{1p} \\\sigma_{21} & \sigma_{22} & \cdots & \sigma_{2p} \\\vdots & \vdots & \ddots & \vdots \\\sigma_{p1} & \sigma_{p2} & \cdots & \sigma_{pp}\end{pmatrix},\quad\Lambda =\begin{pmatrix}\lambda_{11} & \lambda_{12} & \cdots & \lambda_{1k} \\\lambda_{21} & \lambda_{22} & \cdots & \lambda_{2k} \\\vdots & \vdots & \ddots & \vdots \\\lambda_{p1} & \lambda_{p2} & \cdots & \lambda_{pk}\end{pmatrix},\quad\Psi =\begin{pmatrix}\psi_1 & 0 & \cdots & 0 \\0 & \psi_2 & \cdots & 0 \\\vdots & \vdots & \ddots & \vdots \\0 & 0 & \cdots & \psi_p\end{pmatrix}.
$$

1. The diagonal element $\sigma_{ii}=\mathrm{Var}(X_i)$ represents the total variance of variable $X_i$.
  From the model: 

$$
\sigma_{ii}=\lambda_{i1}^2+\lambda_{i2}^2+\dots+\lambda_{ik}^2 +\psi_i
$$

  We can split this part as:

  - $h_i^2 = \lambda_{i1}^2+\lambda_{i2}^2+\dots+\lambda_{ik}^2$, represents the variance of $X_i$ explained by the common factors (communality).
  - $\psi_i$, represents the the variance of $X+i$ not explained by the common factors (uniqueness).
b. The off-diagonal entries (covariance)

For $i \not= j:$

$$
\sigma_{ij}=\mathrm{Cov}(X_i,X_j)=\lambda_{i1}\lambda_{j1}+\dots + \lambda_{ik}\lambda_{jk}
$$

This means:

- The covariances of $X$ only comes from the shared common factors.
- If two variables load on similar factors (with similar $\lambda$ values), they will be more strongly correlated.
<aside>

💡 Intuition: each loading $\lambda_{ir}$ tells how strongly variable $X_i$ is related to the factor $f_r$. If two variables say, $X_i$ and $X_j$ has similar loadings on the same factor, it means they both depend on the same factors with roughly the same strength then their covariance and correlation are high,

</aside>



## 4. Invariance to Scaling

Let $X$ be a $p$-dimensional random vector. Assume a $k$-factor model holds for $X$:

$$
X =\mu_X + \Lambda_X f + e \text{ and } \Sigma_{XX} = \Lambda_X\Lambda_X^\intercal +\Psi_X.
$$

### Scaling transformation

Let $C$ be a $p\times p $ diagonal matrix with positive entries. Define a rescaled variable:

$$
Y=CX
$$

Then:

$$
\mu_Y = C\mu+X,\quad \Sigma_{YY}=\mathrm{Var}(Y)=\mathrm{Var}(CX)=C\mathrm{Var}(X)C=C\Lambda_X(C\Lambda_X)^\intercal+C\Psi_XC.
$$

Let: 

$$
\Lambda_Y = C\Lambda_X, \quad \Psi_Y=C\Psi_X C
$$

Hence,

$$
\Sigma_{YY}=\Lambda_Y\Lambda_Y^\intercal+\Psi_Y
$$

Showing that $Y$ also satisfies $k$-factor model, just with rescaled loadings and uniqueness. Using standardized variables is also rescaling.

## 5. Non-Uniqueness of Factor Loadings

Let $G$ be a $k\times k$ orthogonal matrix, meaning:

$$
GG^\intercal = G^\intercal G = I_k.
$$

Now the $k$-factor model for $X$ be:

$$
X-\mu=\Lambda f+e= \Lambda (GG^\intercal)f+e = (AG)(G^\intercal f) + e
$$

Define:

$$
\Lambda^*=\Lambda G \text{ (rotated loading) }, \quad f^*=G^\intercal f \text{ (rotated factors) }.
$$

Then the model becomes:

$$
X-\mu=\Lambda^*f^* + e.
$$

Both $(\Lambda,f)$ and $(\Lambda^*,f^*)$ yields the same covariance:

$$
\mathrm{Var}(X)=\Lambda\Lambda^\intercal+\Psi = \Lambda^*\Lambda^{*\intercal}+\Psi.
$$

<aside>

💡 Intuition

In the $k$-factor model

$$
X-\mu=\Lambda f + e
$$

the factors $f$ are latent (unobserved) variables, not observed. Because of this, if you rotate the factor space (with orthogonal transformation), we can obtain new factors and loadings that product the exact same covariance structure.

There are infinitely many pairs $(\Lambda, f)$ giving the same model.

</aside>

## 6. Degrees of Freedom

Free parameters are the number of independent quantities we need to estimate from the data to fully specify the model. It represents the degree of freedom in the model.

The $k$-factor model: $X-\mu = \Lambda f + e \;\text{ and }\; \Sigma=\Lambda\Lambda^\intercal + \Psi$.

The number of parameters:

- $\Lambda$ is $p\times k$ dimensional : $p \cdot k$ parameters
- $\Psi$ is $p\times p$ dimensional diagonal: $p$ parameters
- Number of possible rotations $(G)$: $\frac{k(k-1)}{2}$
The total number of free parameters in the model:

$$
N_{\text{model}}=pk +p-\frac{k(k-1)}{2}
$$

<aside>

💡 Intuition of subtracting rotation possibilities:

Initially $\Lambda$ has $p\times k$ parameters

</aside>

### Total Information in Covariance Matrix

The observed covariance matrix $\Sigma$ (or correlation $R$) has:

$$
N_\Sigma=\frac{p(p+1)}{2}
$$

independent entries (since it’s symmetric).

> the covariance matrix is a $p\times p$ symmetric matrix, but this number should be less because $\sigma_{ij}=\sigma_{ji}$. Hence, add 1. $p$ diagonal elements 2. $\frac{p(p-1)}{2}$ off-diagonal elements (because there are $p$ rows, and each row has fewer and fewer off diagonal entries)

### Degrees of Freedom ($d$)

$$
\begin{align*}d = N_{\Sigma}-N_{\mathrm{model}}\\
\fbox{$d=\frac{p(p+1)}{2}-\left[pk+p-\frac{k(k-1)}{2}\right]$} \\
d=\frac{(p-k)^2-(p+k)}{2}
\end{align*}
$$

Interpretation of $d$

- if $d<0$ model is undetermined (too few data, too many parameters, no use of FA)
- if $d=0$ unique solution to the problem (except for rotation)
- if $d>0$ an exact solution does not exist, only approximation. Typical in practice.
## 7. Estimating Model Parameters in FA

We have $X_1,\dots,X_n$ as a $p$-dimensional observations with population mean vector $\mu$ and covariance matrix $\Sigma$. The $k$-factor model assumes:

$$
\Sigma=\Lambda\Lambda^\intercal+\Psi
$$

### Sample to estimation

First, we don’t know population $\Sigma$, but we can estimate it with the sample covariance matrix:

$$
S_n \approx \Sigma
$$

Then we try to estimates $\hat{\Lambda}$ and $\hat{\Psi}$ such that:

$$
S_n \approx \hat{\Lambda}\hat{\Lambda}^\intercal+\hat{\Psi}
$$

### Estimating uniqueness and communalities

if $\hat{\Lambda}=\left[\lambda_{ij}\right]$ is known, then we can compute $\Psi$ directly by:

$$
\hat{\psi}=s_i^2-\hat{h}_i^2
$$

where

$$
\hat{h_i}^2 = \hat{\lambda}_{i1}^2+\hat{\lambda}_{i2}^2+\dots +\hat{\lambda}_{ik}^2
$$

-  $\hat{h}_i$ is the communality (variance explained by common factors)
- $\hat{\psi}_i $ is the uniqueness
- $s_i^2$ is the diagonal element of $S_n$
<aside>

Note:

- The diagonal element of $S_n$ are exactly reproduced because: 
$$
s_i^2=\hat{h}_i^2+\hat{\psi}_i
$$

- The off-diagonal elements are approximated:
$$
s_{ij} \approx \sum_{m=1}^k\hat{\lambda_{im}}\hat{\lambda}_{jm}
$$

</aside>



## 8. Choosing Estimation method (based on effect of scaling)

The parameter of $k$-factor model can be estimated either using:

- Covariance matrix $S_n$ : keeps original scale
- Sample correlation matrix $R_n$ : uses standardized variables (var=1)
There are two type of estimation methods, which are scale invariant and non scale invariant. 

<aside>

Question: Standardizing the dataset means that the covariance matrix = correlation matrix. If so, why bother to use the covariance matrix, shouldn’t the method just ignore covariance matrix altogether, and just use correlation matrix?

</aside>

- Non scale invariant method:
  Using $S_n$ and $R_n$ provide two different estimation of $\Psi $ and $\Lambda$. These methods are based on the least square principle. Given a fixed $p$, they have to minimize 

$$
F(\Lambda,\Psi):=\mathrm{tr}\left[(S_n-\Lambda\Lambda^\intercal-\Psi)^\intercal(S_n-\Lambda\Lambda^\intercal-\Psi)\right]=||S_n -\Lambda\Lambda^\intercal-\Psi||^2=||S_n-\Sigma||^2.
$$

  $F(\Lambda,\Psi)$ measures how far the model factor covariance is from the actual sample covariance.

<aside>

Why trace?

$$
\mathrm{tr}\left[A^\intercal A\right]=\sum_{i,j} |A_{ij}|^2
$$

  Here $A=S_n-\Sigma$, so $\mathrm{tr}\left[A^\intercal A\right]=\sum_{i,j}(S_n-\Sigma)^2_{i,j}$

  This is the sum of squared differences between each element of the observed covariance and the model covariance.

</aside>

- Scale invariant method:
  In this case, factor analysis based on $S_n$ abd $R_n$ result with the same estimators. Example: Maximum likelihood, which assumes Gaussian sample.

### 8.1 Least Squares Estimation in Factor Analysis

Goal: Find $\hat{\Lambda}, \hat{\Psi}$ to approximate $S_n\approx\Lambda\Lambda^\intercal+\Psi$ 

Step 1: Define the objective function

$$
F(\Lambda,\Psi):=\mathrm{tr}\left[(S_n-\Lambda\Lambda^\intercal-\Psi)^\intercal(S_n-\Lambda\Lambda^\intercal-\Psi)\right]=||S_n -\Lambda\Lambda^\intercal-\Psi||^2=||S_n-\Sigma||^2.
$$

Step 2: Normal equations (for minimization, set derivative $=0$)

$$
\begin{align*}
(S_n-\hat{\Lambda}\hat{\Lambda}^\intercal-\hat{\Psi})\hat{\Lambda}=0 \\
\mathrm{diag}(S_n-\hat{\Lambda}\hat{\Lambda}^\intercal-\hat{\Psi})=0

\end{align*}
$$

> No direct solution exist, because there is parameters that needs to be updates $\Lambda$ and $\Psi$. If you fix $\Psi$, you can solve $\Lambda$.

Step 3: Iterative algorithm Choose between Principal Factor Analysis (PFA) or Principal Component Factoring

### 8.1.1. Principal Factor Analysis

Goal: Estimate $\Lambda $ and $\Psi$ suich that

$$
S_n \approx\Lambda\Lambda^T + \Psi
$$

Step 1: Choose initial uniqueness 

$$
\Psi^{(0)}=\mathrm{diag}(\psi^{(0)}_1,\dots,\psi^{(0)}_p)
$$

Step 2: Compute the reduced covariance matrix

$$
S_r = S_n-\Psi^{(0)}
$$

Step 3: Perform spectral decomposition

$$
S_r=Q\Delta Q^\intercal = \sum_{i=1}^p \delta_iq_iq_i^\intercal
$$

where

- $Q = (q_1,\dots,q_p)$  eigen vectors
- $\Delta=\mathrm{diag}(\delta_1,\dots,\delta_p)$
### 🧩 Example: Principal Factor Analysis (2×2 case)

Given:

$$
\begin{align}
S_n &=
\begin{bmatrix}
3 & 1 \\
1 & 3
\end{bmatrix}, &
\Psi^{(0)} &=
\begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix}
\end{align}
$$

### Step 1. Reduced covariance

$$
\begin{align}
S_r &= S_n - \Psi^{(0)} =
\begin{bmatrix}
2 & 1 \\
1 & 2
\end{bmatrix}
\end{align}
$$

### Step 2. Spectral decomposition

Find eigenvalues and eigenvectors of $( S_r )$:

$$
\begin{align}
\det
\begin{bmatrix}
2 - \delta & 1 \\
1 & 2 - \delta
\end{bmatrix}
&= (2 - \delta)^2 - 1 = 0
\\[6pt]
\Rightarrow\; \delta_1 &= 3, \quad \delta_2 = 1
\end{align}
$$

Eigenvectors:

$$
\begin{align}
q_1 &= \frac{1}{\sqrt{2}}
\begin{bmatrix}
1 \\ 1
\end{bmatrix},
&
q_2 &= \frac{1}{\sqrt{2}}
\begin{bmatrix}
1 \\ -1
\end{bmatrix}
\end{align}
$$

So,

$$
\begin{align}
S_r &= Q \Delta Q^\top,
&
Q &= [q_1\ q_2],
&
\Delta &= \mathrm{diag}(3, 1)
\end{align}
$$

### Step 3. Factor loadings (choose $(k = 1)$)

$$
\begin{align}
Q_1 &= [q_1], &
\Delta_1^{1/2} &= [\sqrt{3}]
\\[6pt]
\hat{\Lambda}
&= Q_1 \Delta_1^{1/2}
= \frac{\sqrt{3}}{\sqrt{2}}
\begin{bmatrix}
1 \\[2pt] 1
\end{bmatrix}
\\[6pt]
\hat{\Lambda}\hat{\Lambda}^\top
&= \frac{3}{2}
\begin{bmatrix}
1 & 1 \\
1 & 1
\end{bmatrix}
\end{align}
$$

### Step 4. Update uniqueness

$$
\begin{align}
\hat{\Psi}
&= \mathrm{diag}(S_n - \hat{\Lambda}\hat{\Lambda}^\top)
\\[6pt]
&= \mathrm{diag}
\begin{bmatrix}
3 - 1.5 & 1 - 1.5 \\
1 - 1.5 & 3 - 1.5
\end{bmatrix}
\begin{bmatrix}
1.5 & 0 \\
0 & 1.5
\end{bmatrix}
\end{align}
$$

✅ The diagonal matches the sample variances exactly:

$$
\begin{align}
1.5\;(\text{communality}) + 1.5\;(\text{uniqueness}) = 3 = S_{11} = S_{22}
\end{align}
$$

Step 4: Keep the first $k$ eigenpairs:

$$
S_r \approx \sum_{i=1}^k \delta_iq_iq_i^\intercal
$$

Step 5: Estimate factor loading (covariance of factors)

$$
\hat{\Lambda}=Q_k \Delta_k^{1/2}=\left[\sqrt\delta_1 q_1,\dots,\sqrt\delta_k q_k\right]
$$

Step 6: Update uniqueness

$$
\hat{\Psi}=\mathrm{diag}(S_n-\hat{\Lambda}\hat{\Lambda}^\intercal)
$$

<aside>

💡 Common initial value for $\hat{\Psi}$

1. if using sample covariance matrix $S_n:$
$$
\hat{\Psi}^{(0)}=\left[\mathrm{diag(S_n^{-1})}\right]^{-1}
$$

Intuition: Taking the diagonal of $S_n^{-1}$ and then inverting each element gives an estimate of how much unique variance each variable contributes.

b.  if  using correlation matrix $R_n:$

$$
\hat{\Psi}^{(0)}=\left[\mathrm{diag(R_n^{-1})}\right]^{-1}
$$

</aside>



### 8.1.2  Principal Component Factoring

Goal: Estimate $\hat{\Lambda}$ and $\hat{\Psi}$ such that

$$
S_n \approx\Lambda\Lambda^T + \Psi
$$

Unlike Principal Factor Analysis, PCF is non iterative and based directly on the spectral decomposition of the sample covariance matrix.

Step 1: Perform spectral decomposition

$$
S_n=Q\Delta Q^\intercal = \sum_{i=1}^p \delta_iq_iq_i^\intercal
$$

where 

- $Q=(q_1,\dots,q_p)$ matrix of orthonormal eigenvectors
- $\Delta=\mathrm{diag}(\delta_1,\dots,\delta_p)$ diagonal matrix of eigenvalues $(\delta_1\ge\dots\ge\delta_p\ge0)$
Step 2: Keep the first $k$ eigen pairs

$$
S_r \approx \sum_{i=1}^k \delta_iq_iq_i^\intercal
$$

Step 3: Estimate factor loadings

$$
\hat{\Lambda}=Q_k \Delta_k^{1/2}=\left[\sqrt\delta_1 q_1,\dots,\sqrt\delta_k q_k\right]
$$

Each loading element is 

$$
\hat{\lambda}_{ij}=\sqrt \delta_{j}q_{ij}
$$

where

- $i = 1,\dots,p $ (variable index)
- $j = 1,\dots,k$ (factor index)
Step 4: Estimate communalities

$$
\hat{h}_i=\lambda^2_{i1}+\lambda^2_{i2}+\dots+\lambda^2_{ik}=\delta_{1}q_{i1}^2+\delta_{2}q_{i2}^2+\dots+\delta_{k}q_{ik}^2
$$

The communality represents the portion of variance of variable $i$ explained by the $k$ common factors

Step 5: Estimate uniqueness

$$
\hat{\psi}_i=s_{i}^2-\hat{h}_i^2
$$

where $s_i^2$ is the sample variance of variable $i$.

Step 6: Check model fit

The residual is bounded by the sum of the squared discarded eigenvalues:

$$
|| S_n-\hat{\Lambda}\hat{\Lambda}^\intercal-\hat{\Psi}||^2\le\sum^{p}_{k=k+1}\delta_j^2
$$

Suppose the sample covariance matrix is 

$$
\begin{align}
S_n =
\begin{bmatrix}
3 & 1 \\
1 & 2
\end{bmatrix}
\end{align}
$$

##  Step 1. Spectral decomposition   

Find eigenvalues$ (\delta_1, \delta_2)$ and eigenvectors$ (q_1, q_2)$.

$$
\begin{align}\det\begin{bmatrix}3-\delta & 1\\1 & 2-\delta\end{bmatrix}&= (3-\delta)(2-\delta)-1 = 0 \\\Rightarrow \delta^2 - 5\delta + 5 &= 0 \\\Rightarrow \delta_{1,2} &= \frac{5 \pm \sqrt{5}}{2}\end{align}
$$

$$
\begin{align}\delta_1 \approx 3.618,\quad \delta_2 \approx 1.382\end{align}
$$

Eigenvectors:

$$
\begin{align}q_1 &\approx\begin{bmatrix}0.850\\0.526\end{bmatrix},\quad q_2 \approx\begin{bmatrix}0.526\\-0.850\end{bmatrix}\end{align}
$$

So

$$
\begin{align}Q &=\begin{bmatrix}0.850 & 0.526\\0.526 & -0.850\end{bmatrix},\quad\Delta =\begin{bmatrix}3.618 & 0\\0 & 1.382\end{bmatrix}\end{align}
$$

## Step 2. Keep the first $(k=1)$ eigenpair

$$
\begin{align}S_n \approx \delta_1 q_1 q_1^\top\end{align}
$$

## Step 3. Estimate factor loadings  

$$
\begin{align}\hat{\Lambda} &= Q_k \Delta_k^{1/2}= q_1 \sqrt{\delta_1} \\&=\begin{bmatrix}0.850\\0.526\end{bmatrix}\times1.902=\begin{bmatrix}1.617\\1.000\end{bmatrix}\end{align}
$$

$$
\begin{align}\hat{\Lambda}\hat{\Lambda}^\top &=\begin{bmatrix}2.61 & 1.62\\1.62 & 1.00\end{bmatrix}\end{align}
$$

## Step 4. Estimate communalities  

$$
\begin{align}\hat{h}_1^2 &= 1.617^2 = 2.61, \\\hat{h}_2^2 &= 1.000^2 = 1.00\end{align}
$$

## Step 5. Estimate uniqueness  

$$
\begin{align}\hat{\psi}_1 &= 3 - 2.61 = 0.39, \\\hat{\psi}_2 &= 2 - 1.00 = 1.00\end{align}
$$

$$
\begin{align}\hat{\Psi} &=\begin{bmatrix}0.39 & 0\\0 & 1.00\end{bmatrix}\end{align}
$$

## Step 6. Approximation check  

$$
\begin{align}\hat{\Lambda}\hat{\Lambda}^\top + \hat{\Psi} &=\begin{bmatrix}2.61 & 1.62\\1.62 & 1.00\end{bmatrix}+\begin{bmatrix}0.39 & 0\\0 & 1.00\end{bmatrix} \\&=\begin{bmatrix}3.00 & 1.62\\1.62 & 2.00\end{bmatrix}\approx S_n\end{align}
$$

## Step 7. Interpretation  

- $Q = (q_1, q_2)$ are eigenvectors (directions of variance).
- For $(k=1)$, each loading$ (\lambda_{i1} = \sqrt{\delta_1}\,q_{i1})$.
- Communalities$ (h_i^2)$ show how much variance of variable$ (i)$ is captured by the factor.
- Uniquenesses$ (\psi_i)$ are the remaining variances not explained by the factor.
### 8.2 Maximum Likelihood Factor Analysis (MLFA)

Goal: Estimate $\Lambda$ and $\Psi $ under the multivariate normal assumption by maximizing the likelihood of the sample.

Model assumption:

$$
X_i=\mu+\Lambda f_i+e_i
$$

$$
f_i \sim N_k(0,I_k), \quad e_i\sim N_p(0,\Psi), \\
\implies X_i\sim N_p(\mu,\Sigma), \quad \Sigma=\Lambda\Lambda^\intercal+\Psi
$$

1. Log-likelihood function for the sample
$$
l(X_1,\dots,X_n|\mu,\Sigma)=-\frac{n}{2}\left[p \log(2\pi) +\log|\Sigma| + \mathrm{tr}(\Sigma^{-1}S_n) +(\bar{X}-\mu)^\intercal\Sigma^{-1}(\bar{X}-\mu)\right].
$$

1. Estimate of the mean
Differentiate with respect to $\mu$

$$
\frac{\partial l}{\partial\mu}=0 \implies \hat{\mu}=\bar{X}.
$$

This means the value of $\mu$ that maximizes the likelihood is the sample mean.

1. Simplified log-likelihood
Substitute $\hat{\mu}=\bar{X}$

$$
l(X_1,\dots,X_n|\hat{\mu},\Sigma)=-\frac{n}{2}\left[p\log(2\pi) + \log|\Sigma|+\mathrm{tr}(\Sigma^{-1}S_n))\right].
$$

Next substitute the factor model $\Sigma = \Lambda\Lambda^\intercal+\Psi$

$$
l(X_1,\dots,X_n|\mu,\Sigma)=-\frac{n}{2}\left[p\log(2\pi) + F(X_1,\dots,X_n|\Lambda,\Psi) \right], \quad \text{where}
$$

$$
F(X_1,\dots,X_n|\Lambda,\Psi)  = \log|\Lambda\Lambda^\intercal+\Psi|+\mathrm{tr}((\Lambda\Lambda^\intercal+\Psi)^{-1}S_n))
$$

1. Optimization problem
We have to optimize:

$$
\min_{\Lambda,\Psi} F(X_1,\dots,X_n|\Lambda,\Psi)  = \log|\Lambda\Lambda^\intercal+\Psi|+\mathrm{tr}((\Lambda\Lambda^\intercal+\Psi)^{-1}S_n))
$$

<aside>

💡 Invariance to scaling (brief summary)

In Maximum Likelihood Factor Analysis, scaling the data (multiplying by a diagonal matrix$ ( C )$ changes the covariance as

$$
\begin{align}
\mathrm{Var}(CX) = C(\Lambda\Lambda^\top + \Psi)C.
\end{align}
$$

The log-likelihood becomes



$$
\begin{align}
F(CX) = 2\log\det(C) + F(X),
\end{align}
$$


where the extra term$ ( 2\log\det(C))$ is constant.

Therefore, MLFA estimates are scale-invariant — results are the same whether using the covariance or correlation matrix.

</aside>

### 8.2.1 Maximization of the Likelihood Function

Objective function 

$$
F(X_1,\dots,X_n|\Lambda,\Psi)  = \log|\Lambda\Lambda^\intercal+\Psi|+\mathrm{tr}((\Lambda\Lambda^\intercal+\Psi)^{-1}S_n))
$$

Equivalent form:

$$
G(\Lambda,\Psi)  =  \mathrm{tr}((\Lambda\Lambda^\intercal+\Psi)^{-1}S_n)-\log(|\Lambda\Lambda^\intercal+\Psi|^{-1}S_n)-[
$$

Two step iterative maximization

1. Fix $\Psi$, minimize $G$ in $\Lambda$
1. Fix $\Lambda$, minimize $G$ in $\Psi$


TBC. The analytics solution for MLE, Properties of MLE

TBC LIkelihood ratio test, for numberof common factors (Based on x2 distribution)

TBC Extracting Factor Scores

TBC Rotation of Factors

