# payer-points

Coding excercise given as a take home assessment.

## Problem

Our users have points in their accounts. Users only see a single balance in their accounts. But for reporting purposes we actually track their
points per payer/partner. In our system, each transaction record contains: payer (string), points (integer), timestamp (date).
For earning points it is easy to assign a payer, we know which actions earned the points. And thus which partner should be paying for the points.
When a user spends points, they don't know or care which payer the points come from. But, our accounting team does care how the points are
spent. There are two rules for determining what points to "spend" first:

● We want the oldest points to be spent first (oldest based on transaction timestamp, not the order they’re received)

● We want no payer's points to go negative.

#### We expect your web service to provide routes that:

● Add transactions for a specific payer and date.

● Spend points using the rules above and return a list of { "payer": <string>, "points": <integer> } for each call.

● Return all payer point balances.

#### Note:

● We are not defining specific requests/responses. Defining these is part of the exercise.

● We don’t expect you to use any durable data store. Storing transactions in memory is acceptable for the exercise.

[Link to Problem](https://fetch-hiring.s3.us-east-1.amazonaws.com/points.pdf)

## Solution Approach

Since storing transactions in memory is acceptable, I'm going to use 2 data structures for quick insertions, removals, and lookups.

1. Hashtable - I picked this data structure for looking up point balances by payer. We don't need to store seperate transactions, only each payer and the point totals.
2. Heap - Since we always want to pick the record with the oldest timestamp, I thought a minimum heap would be great for getting the minimum record by timestamp. We need to store the timestamp and keep the data heapified by oldest timestamp.

## Running the Code

Prerequisite: Must have node.js installed

1. `git clone https://github.com/shanehonanie/payer-points.git`
2. Navigate to the root of the project
3. `npm install`
4. `npm start`

## Endpoints

### Lookup Point Balance by Payer

`GET` `http://localhost:3000/points`

**Headers**

Content-Type: application/json

**Sample Response:**

```
{
    "DANNON": 1000,
    "UNILEVER": 0,
    "MILLER COORS": 5300
}
```

### Add Points

`POST` `http://localhost:3000/add`

**Headers**

Content-Type: application/json

**Body**
payer (string, required)

points (integer, required)

timestamp (string, required, ISO 8601 formatted)

**Sample Response:**

HTTP Status Code: 201 Created (No Body)

### Spend Points

`POST` `http://localhost:3000/point/spend`

**Headers**

Content-Type: application/json

**Body**

payer (string, required)

points (integer, required)

timestamp (string, required, ISO 8601 formatted)

**Sample Response:**

```
[
    {
        "DANNON": -100,
        "UNILEVER": -200,
        "MILLER COORS": -4700
    }
]
```
