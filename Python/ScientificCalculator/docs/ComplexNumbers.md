# Complex Numbers

Status

Planned for a future release.

---

## Introduction

A complex number is written as

z = a + bi

where

a = Real Part

b = Imaginary Part

i = √(-1)

Remember

i² = -1

---

## Quick Facts

Real Number

3

Complex Number

3 + 4i

Pure Imaginary

4i

---

# real(z)

Purpose

Returns the real part.

Example

real(3+4i)

=3

---

# imag(z)

Purpose

Returns the imaginary part.

Example

imag(3+4i)

=4

---

# conj(z)

Purpose

Returns the complex conjugate.

Formula

conj(a+bi)=a-bi

Example

conj(3+4i)

=3-4i

Remember

Only the sign of i changes.

---

# mod(z)

Purpose

Returns the modulus (length).

Formula

|z|=√(a²+b²)

Example

mod(3+4i)

=5

Remember

Think of a right triangle.

---

# arg(z)

Purpose

Returns the angle of a complex number.

Formula

θ=atan(imaginary/real)

Example

arg(1+i)

=45°

Remember

Use tangent.

---

# polar(z)

Purpose

Converts rectangular form into polar form.

Formula

z=r(cosθ+i sinθ)

Example

polar(3+4i)

=(5,53.13°)

---

# rect(r,θ)

Purpose

Converts polar form into rectangular form.

Formula

x=r cosθ

y=r sinθ

Example

rect(5,53.13°)

=3+4i

---

# cis(θ)

Purpose

Returns

cis(θ)=cos(θ)+i sin(θ)

Examples

cis(0)=1

cis(90)=i

cis(180)=-1

cis(270)=-i

Remember

CIS = cos + i sin

---

# norm(z)

Purpose

Returns the squared modulus.

Formula

|z|²=a²+b²

Example

norm(3+4i)

=25

---

# csqrt(z)

Purpose

Returns the complex square root.

Example

csqrt(-4)

=2i

---

# inverse(z)

Purpose

Returns the reciprocal.

Formula

1/z

Example

inverse(1+i)

=0.5-0.5i

---

# normalize(z)

Purpose

Returns a complex number whose modulus is 1.

Formula

z/|z|

Example

normalize(3+4i)

=0.6+0.8i
