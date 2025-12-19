---
title: "Multidimensional Scaling (MDS)"
date: "2025-11-26"
updated: "2025-12-19T13:51:00+00:00"
subjects: ['data science']
topics: ['Dimensionality Reduction']
---

Problem setup:

Multidimensional scaling aims to reconstruct the position of $n$ objects in euclidean space with pairwise distances (proximities) between them. For $n$ objects, there are 

$$
\frac{n(n-1)}{2}
$$

unique distances. MDS uses these distances to place the points in a low dimensional space (2D or 3D) so that the geometry of the reconstructed configuration reflects the given distances as closely as possible. 

This method is useful for:

- Original coordinates of coordinates are unknown.
- Only dissimilarity/distances are availability.
- The distance doesn’t always have to be euclidean.


# 1. Distance Matrices

## Definition of Distance (Proximity) Matrix

A distance matrix is an $n\times x$ matrix

$$
\Delta=(\delta_{ij})^n_{i,j=1}
$$

That contains the pairwise distances or dissimilarities between $n$ objects. A matrix qualifies as a distance matrix if it satisfies:

$$
\delta_{ij}=\delta_{ji}, \quad \delta\ge0, \quad \delta_{ii}=0
$$

## Goal of MDS using a distance matrix

Given the distance $\Delta$, the object is to find points 

$$
x_1,x_2,\dots,x_n \in \mathbb{R}^p
$$

such that the Euclidean distances between these reconstructed points,

$$
D=(d_{ij}),\quad d_{ij}=||x_i-x_j||
$$

are as similar as possible to the original distances $\delta_{ij}$. The resulting configuration is not unique/invariant under translation, rotation, reflection.

<aside>

Example: you have the distances between 10 cities. Then you can create matrix $\Delta$ that contains all pairwise distances. MDS tries to rebuilt the coordinate $x_1,\dots,x_n \in \mathbb{R}^p$, where $p=2$ for 2D, etc. After placing the points, we can calculate the straightline distances $d_{ij}$. The goal is to make $d_{ij}\approx\delta_{ij}$

</aside>

## Metric vs Non-Metric MDS

### Metric MDS

- Uses the actual numerical values of the distances $\delta_{ij}$.
- The positions $x_1,\dots,x_n$ are computed directly from the entries of $\Delta$
- Tries to match $\delta_{ij}$ and $d_{ij}$ as closely as possible.
- Sensitive to the scale of distances
### Non-metric MDS

- Uses only the rank order of the dissimilarities:
$$
\delta_{i1j1}\le\dots\le \delta_{imjm}, \quad m=\frac{n(n-1)}{2}
$$

- Invariant with respect to uniform expansion (multiplying all distances by a constant) or contraction.
- Focuses on relative similarity, not exact magnitude.
# 2. Euclidean Distance Matrices

## Definition

A $n\times n$ distance matrix 

$$
\Delta=(\delta_{ij})^n_{i,j=1}
$$

is called euclidean if there exist a set of points 

such that the squared distances satisfy:

$$
\delta_{ij}^2=||x_i-x_j||^2_2=(x_i-x_j)^\intercal(x_i=x_j)
$$

$$
x_1,x_2,\dots,x_n\in \mathbb{R}^p
$$

This means:

- The distances in $\Delta$ can be represented exactly as Euclidean distances between points in some $p$-dimensional space.
- Not all distance matrices are euclidean, some cannot come from actual coordinates.
## Centering 

To reconstruct coordinates from distances, we need to remove the effect of translation (moving all the points) as follows:

$$
H=I_n-\frac{1}{n}1_n
$$

where $I_n$ is $n\times n$ matrix of ones. Then suppose $X=(x_1,\dots,x_n)^\intercal$ is the matrix of coordinates, where each $x_i \in \mathbb{R}^p$. Let $\bar{x}$ be the centroid:

$$
\bar{x}=\frac{1}{n}\sum^n_{i=1}x_i

$$

Hence,

$$
HX=(x_1-\bar{x},\dots,x_n-\bar{x})
$$

Thus:

- MDS always works in a centered coordinate, because distances are unaffected by translation.
- HX gives the coordinates centered at the origin.
# 3. Conditions for a Distance matrix to be Euclidean

Let 

$$
\Delta=(\delta_{ij})
$$

be an $n\times n$ distance matrix. Define the matrix

$$
A=(a_{ij}),\quad a_{ij}=-\frac{1}{2}\delta^2_{ij},
$$

and let

$$
B=HAH,
$$

where $H=I_n-\frac{1}{n}1_n$ is the centering matrix.

A distance matrix $\Delta $ is Euclidean if and only if the matrix $B=(b_{ij})$ is positive semidefinite. 

## a. if $\Delta$ comes from actual Euclidean Points

If $\Delta $ is the matrix of Euclidean interpoint distances for a configuration,

$$
X=(\mathbf{x}_1,\dots,\mathbf{x}_n)^\intercal.
$$

Let $\bar{x}$ be the centroid of points and consider the centered coordinate matrix as

$$
HX=(x_1-\bar{x},\dots,x_n-\bar{x}).
$$

The Gram (inner-product) matrix of these centered point is 

$$
B=(HX)(HX)^\intercal.
$$

Entry-wise, this means:

$$
b_{ij}=(x_i-\bar{x})^\intercal(x_j-\bar{x})
$$

Because the matrix of a form $AA^\intercal$ is always positive semidefinite, 

$$
B\ge0.
$$

<aside>

Why we calculate the inner-product (Gram) matrix?

In MDS we need coordinates, but we are only given the distance matrix. Thus, to we need to calculate the inner product Gram matrix $B=XX^\intercal.$ Centering unsures the mean is zero → use $HX$. Therefore, $B=(HX)(HX)^\intercal$. We convert distances to inner products using  $B=H(-0.5\Delta^2)H.$ This allows reconconstruction of the point via eigenvalues/eigenvectors. 

</aside>

## b. Reconstructing coordinates when $B$ is PSD.

Assume the opposite direction:

- Start with $\Delta$
- Form $A=-\frac{1}{2}\Delta^{2}.$
- Form $B=HAH$
- Suppose $B$ is positive semidefinite with rank $p$.
Then the configuration of point in $\mathbb{R}^p$ can be constructed as follows:

Let 

$$
\lambda_1\ge\dots\ge\lambda_p>0
$$

be positive eigen values of $B$, with corresponding eigenvectors

$$
\mathbf{x}^{(1)},\dots,\mathbf{x}^{(p)}.
$$

Normalize so that 

$$
\mathbf{x}^{(i)\intercal}\mathbf{x}^{(i)}=\lambda_i
$$

Construct the matrix $X=(\mathbf{x}^{(1)},\dots,\mathbf{x}^{(p)})$ and define $x_i$, as the $i$-th row of the matrix $X$



Then the entries of $\Delta$ are euclidean distances of points $\mathbf{x_1},\dots,\mathbf{x_n},$ where $\bar{\mathbf{x}}=0$, and $B$ is the inner product matrix of this configuration that is $B=XX^\intercal$. 



# 4. Classical Solution

The goal is to reconstruct $x_1,\dots,x_n\in \mathbb{R}^p$ form the distances $\delta_{ij}$. The alrorithm proceeds in 5 steps.

I. Start with the distance matrix

$$
\Delta=(\delta_{ij}).
$$

Construct the matrix:

$$
A=(a_{ij}), \quad a_{ij}=-\frac{1}{2}\delta^{2}_{ij}.
$$

<aside>

Why this form?

Because squared distances have linear relationship with inner products:

$$
||x_i-x_j||^2=x_i^\intercal x_i + x_j^\intercal x_j - 2 x_i^\intercal x_j.
$$

The factor $-\frac{1}{2}$ are used for the matrix in the next step (double centering), which extract the Gram matrix.

</aside>

II. Double Center the matrix

Let 

$$
H=I_n-\frac{1}{n}1_n
$$

be the centering matrix.

Form:

$$
B=HAH
$$

> This step converts $A$ into the Gram matrix of the centered points:

$$
B=X X^\intercal.
$$

<aside>

- $B=HAH$ is when you compute the matrix from the distance data.
- $B=X X^\intercal$ is what the same matrix means if the distance comes from euclidean formula.
</aside>

III. Compute the spectral decomposition

Find the eigenvalues and eigenvectors of $B$

$$
B=\Gamma\Lambda\Gamma^\intercal
$$

where,

- $\lambda_1,\dots,\lambda_n$ are the eigenvalues of $B$.
- $\gamma_{(1)},\dots,\gamma_{(n)}$ are the corresponding orthonormal eigenvectors
IV. Recover the coordinate matrix

If $B$ is positive semidefinite and has rank $p$, then only the first $p$ eigenvalues are positive:

$$
\lambda_1\ge\dots\ge\lambda_p>0, \lambda_{p+1}=\dots=\lambda_n=0.
$$

Let

$$
\Lambda_p=\mathrm{diag}(\lambda_1,\dots,\lambda_p), \quad\Gamma_p=(\gamma_{(1),\dots},\gamma_{(p)}).
$$

Define the coordinate matrix

$$
X=\Gamma_p\Lambda_p^{1/2}.
$$

Rows $\mathbf{x}_1,\dots,\mathbf{x}_n\in \mathbb{R}$ of the matrix $X$ give the classical solution of MDS with interpoint distances are $\delta^2_{ij}=||x_i-x_j||^2_2$.

V. Produce lower dimensional approximation

If the rank $p$ is large, or if you want a lower-dimensional representation, use only the largest $k$ eigen values:

$$
X_k=\Gamma_k\Lambda_k^{1/2}, \quad k<p.
$$

This gives an approximate solution:

$$
\delta_{ij}^2 \approx ||x_i-x_j||^2,
$$

because the smaller eigenvalues have been discarded.

