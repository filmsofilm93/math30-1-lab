import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'PCBT1.fcp': [
    {
      say: 'The **fundamental counting principle**: if one choice has $m$ options and a second choice has $n$ options, you can make both choices in $m \\times n$ ways. You multiply.',
      example: ['3 shirts and 4 pants.', 'Pick a shirt **and** pick pants.', '$3 \\times 4 = 12$ outfits.'],
      check: { q: 'You have 5 hats and 2 scarves. How many hat-and-scarf pairs can you make?', options: ['$10$', '$7$', '$25$', '$32$'], answer: 0, why: '$5 \\times 2 = 10$. Two choices made together means multiply.' },
    },
    {
      say: 'A **slot diagram** is one box for each choice. Write how many options go in each box, then multiply the boxes.',
      example: ['A code is 2 letters, then 1 digit. Repeats are allowed.', 'Boxes: $\\boxed{26}\\,\\boxed{26}\\,\\boxed{10}$', '$26 \\times 26 \\times 10 = 6760$'],
      check: { q: 'A code is 3 digits, and digits may repeat. How many codes are there?', options: ['$1000$', '$720$', '$30$', '$999$'], answer: 0, why: 'Each of the 3 boxes has 10 digits: $10 \\times 10 \\times 10 = 1000$.' },
    },
    {
      say: '**Repetition allowed** means you can reuse an option, so every box has the full count. **No repetition** means each box has one fewer option than the box before.',
      example: ['3-digit codes from 0 to 9, no repeats.', 'First box: 10. Second: 9. Third: 8.', '$10 \\times 9 \\times 8 = 720$'],
      check: { q: 'How many 2-letter codes use the letters A to E if letters cannot repeat?', options: ['$20$', '$25$', '$10$', '$9$'], answer: 0, why: '5 letters for the first box, then 4 are left: $5 \\times 4 = 20$.' },
    },
    {
      say: 'When a box has a rule, such as "must be odd", fill that **restricted** box first. Then fill the other boxes with what is left.',
      example: ['Odd 3-digit numbers from the digits 1 to 9, no repeats.', 'Last digit must be odd (1, 3, 5, 7, 9): 5 choices.', 'First digit: 8 digits left.', 'Middle digit: 7 left.', '$8 \\times 7 \\times 5 = 280$'],
      check: { q: 'How many 2-digit even numbers can you make from the digits 1 to 5 with no repeats?', options: ['$8$', '$10$', '$20$', '$6$'], answer: 0, why: 'Last digit 2 or 4: 2 choices. First digit: 4 left. $4 \\times 2 = 8$.' },
    },
    {
      say: 'A number can never start with 0, or it would be a shorter number. So when the digits are 0 to 9, the first box has only 9 choices.',
      example: ['3-digit numbers, digits may repeat.', 'First box: 1 to 9, so 9.', 'Other boxes: 10 each.', '$9 \\times 10 \\times 10 = 900$'],
      check: { q: 'How many 2-digit numbers are there (10 to 99)?', options: ['$90$', '$100$', '$81$', '$99$'], answer: 0, why: '9 choices for the first digit and 10 for the second: $9 \\times 10 = 90$.' },
    },
    {
      say: '**And** means both things happen, so you multiply. **Or** means one case or the other, with no overlap, so you add.',
      example: ['3 soups and 4 mains.', 'A soup **and** a main: $3 \\times 4 = 12$.', 'A soup **or** a main (one dish only): $3 + 4 = 7$.'],
      check: { q: 'A café has 4 sandwiches and 3 salads. You order one sandwich or one salad. How many choices?', options: ['$7$', '$12$', '$4$', '$3$'], answer: 0, why: '"Or" means one item from either list: $4 + 3 = 7$.' },
    },
    {
      say: 'Many questions mix both. Multiply the "and" choices inside each case, then add the "or" cases.',
      example: ['A lunch is a sandwich (4) **and** a drink (3), **or** a soup (2) alone.', 'Sandwich and drink: $4 \\times 3 = 12$.', 'Soup alone: $2$.', 'Total: $12 + 2 = 14$.'],
      check: { q: 'A meal is a pasta (3) and a dessert (2), or a pizza (5) alone. How many meals?', options: ['$11$', '$30$', '$10$', '$8$'], answer: 0, why: 'Pasta and dessert: $3 \\times 2 = 6$. Add the 5 pizzas: $6 + 5 = 11$.' },
    },
  ],

  'PCBT1.factorial': [
    {
      say: '$n!$ is read "**n factorial**". It means multiply $n$ by every whole number below it, down to 1.',
      example: ['$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1$', '$= 120$'],
      check: { q: 'What is $4!$?', options: ['$24$', '$10$', '$16$', '$4$'], answer: 0, why: '$4 \\times 3 \\times 2 \\times 1 = 24$.' },
    },
    {
      say: '$n!$ counts the ways to put $n$ different objects in a row. One special value to remember: $0! = 1$.',
      example: ['Arrange 3 books in a row.', 'First spot: 3 choices. Next: 2. Last: 1.', '$3 \\times 2 \\times 1 = 3! = 6$ orders.'],
      check: { q: 'In how many orders can 5 people stand in a line?', options: ['$120$', '$25$', '$15$', '$5$'], answer: 0, why: '$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.' },
    },
    {
      say: 'The key step: $n! = n \\times (n - 1)!$. You can stop writing out the factors at any factorial you like.',
      example: ['$6! = 6 \\times 5!$', '$6! = 6 \\times 5 \\times 4!$', 'Both equal $720$.'],
      check: { q: 'Which is equal to $8!$?', options: ['$8 \\times 7!$', '$8 \\times 7$', '$7! + 8$', '$8 \\times 8!$'], answer: 0, why: 'Take off the first factor, 8, and what is left is $7!$.' },
    },
    {
      say: 'To divide factorials, **cancel** instead of multiplying everything out. Write the bigger factorial down until the smaller one appears, then cross both out.',
      example: ['$\\frac{9!}{7!} = \\frac{9 \\times 8 \\times 7!}{7!}$', 'Cancel the $7!$.', '$9 \\times 8 = 72$'],
      check: { q: 'Evaluate $\\frac{10!}{8!}$.', options: ['$90$', '$2$', '$\\frac{5}{4}$', '$720$'], answer: 0, why: '$\\frac{10 \\times 9 \\times 8!}{8!} = 10 \\times 9 = 90$.' },
    },
    {
      say: 'Sometimes a factorial is still left on the bottom after you cancel. Work it out and divide.',
      example: ['$\\frac{7!}{4!\\,3!} = \\frac{7 \\times 6 \\times 5 \\times 4!}{4!\\,3!}$', 'Cancel $4!$: $\\frac{7 \\times 6 \\times 5}{3!}$', '$= \\frac{210}{6} = 35$'],
      check: { q: 'Evaluate $\\frac{6!}{4!\\,2!}$.', options: ['$15$', '$30$', '$360$'], answer: 0, why: '$\\frac{6 \\times 5 \\times 4!}{4!\\,2!} = \\frac{30}{2} = 15$.' },
    },
    {
      say: 'The same idea works with a variable. Each factor is one less than the one before it.',
      example: ['$\\frac{(n + 1)!}{(n - 1)!}$', '$= \\frac{(n + 1)(n)(n - 1)!}{(n - 1)!}$', 'Cancel $(n - 1)!$.', '$= n(n + 1)$'],
      check: { q: 'Simplify $\\frac{n!}{(n - 2)!}$.', options: ['$n(n - 1)$', '$2$', '$n - 2$', '$n(n - 1)(n - 2)$'], answer: 0, why: '$n! = n(n - 1)(n - 2)!$, so the $(n - 2)!$ cancels and $n(n - 1)$ is left.' },
    },
    {
      say: 'A factorial needs a whole number that is 0 or more. So $(n - 2)!$ only makes sense when $n - 2 \\ge 0$, which means $n \\ge 2$.',
      example: ['$(n - 3)!$ needs $n - 3 \\ge 0$.', 'Add 3 to both sides: $n \\ge 3$.'],
      check: { q: 'What restriction does $(n - 4)!$ put on $n$?', options: ['$n \\ge 4$', '$n \\ge -4$', '$n > 4$', '$n \\ge 0$'], answer: 0, why: '$n - 4 \\ge 0$ gives $n \\ge 4$. $n = 4$ is allowed because $0! = 1$.' },
    },
    {
      say: 'Going backward: whole numbers in a row multiplied together make a quotient of factorials. Divide by the factorial that starts just below the last factor.',
      example: ['$8 \\times 7 \\times 6$', 'The last factor is 6, so divide out $5!$.', '$8 \\times 7 \\times 6 = \\frac{8!}{5!}$'],
      check: { q: 'Which is equal to $10 \\times 9 \\times 8 \\times 7$?', options: ['$\\frac{10!}{6!}$', '$\\frac{10!}{7!}$', '$\\frac{10!}{5!}$', '$\\frac{10!}{4!}$'], answer: 0, why: '$\\frac{10!}{6!}$ cancels everything from 6 down, leaving $10 \\times 9 \\times 8 \\times 7$.' },
    },
  ],

  'PCBT2.npr': [
    {
      say: 'A **permutation** is an arrangement where **order matters**. Picking Ann then Bo is different from picking Bo then Ann.',
      example: ['Gold and silver medals go to two of Ann, Bo and Cy.', 'Ann gold, Bo silver is one outcome.', 'Bo gold, Ann silver is a different outcome.'],
      check: { q: 'Which situation is a permutation?', options: ['Electing a president and a vice-president', 'Picking 3 pizza toppings', 'Picking 2 people for a team', 'Dealing a hand of 5 cards'], answer: 0, why: 'The two jobs are different, so swapping the people gives a new outcome.' },
    },
    {
      say: 'You can count a permutation with boxes. To arrange $r$ of $n$ different objects, use $r$ boxes, starting at $n$ and going down by one each box.',
      example: ['A president, vice-president and treasurer from 8 people.', 'Boxes: $\\boxed{8}\\,\\boxed{7}\\,\\boxed{6}$', '$8 \\times 7 \\times 6 = 336$'],
      check: { q: 'In how many ways can 1st and 2nd place go to 2 of 6 runners?', options: ['$30$', '$36$', '$15$', '$12$'], answer: 0, why: '6 choices for 1st, then 5 for 2nd: $6 \\times 5 = 30$.' },
    },
    {
      say: 'The formula is ${}_nP_r = \\frac{n!}{(n - r)!}$. Here $n$ is how many objects you have, and $r$ is how many you arrange.',
      example: ['${}_8P_3 = \\frac{8!}{(8 - 3)!} = \\frac{8!}{5!}$', '$= \\frac{8 \\times 7 \\times 6 \\times 5!}{5!}$', '$= 8 \\times 7 \\times 6 = 336$'],
      check: { q: 'Evaluate ${}_5P_2$.', options: ['$20$', '$10$', '$60$', '$3$'], answer: 0, why: '$\\frac{5!}{3!} = 5 \\times 4 = 20$.' },
    },
    {
      say: 'A shortcut: ${}_nP_r$ is $r$ factors multiplied, starting at $n$ and counting down.',
      example: ['${}_{10}P_4$ has 4 factors, starting at 10.', '$10 \\times 9 \\times 8 \\times 7$', '$= 5040$'],
      check: { q: 'Which product equals ${}_9P_3$?', options: ['$9 \\times 8 \\times 7$', '$9 \\times 8 \\times 7 \\times 6$', '$9 \\times 3$', '$3 \\times 2 \\times 1$'], answer: 0, why: '${}_9P_3$ has 3 factors, starting at 9.' },
    },
    {
      say: 'Two special cases. Arranging all $n$ objects gives ${}_nP_n = n!$. Arranging none gives ${}_nP_0 = 1$.',
      example: ['${}_4P_4 = \\frac{4!}{0!} = \\frac{24}{1} = 24$', '${}_4P_0 = \\frac{4!}{4!} = 1$'],
      check: { q: 'Evaluate ${}_6P_6$.', options: ['$720$', '$1$', '$36$', '$6$'], answer: 0, why: '${}_6P_6 = 6! = 720$.' },
    },
    {
      say: 'A word with no repeated letters can have all its letters arranged in $n!$ ways. Using only $r$ of the letters gives ${}_nP_r$.',
      example: ['PLANE has 5 different letters.', 'All 5 letters: $5! = 120$.', '3-letter arrangements: ${}_5P_3 = 5 \\times 4 \\times 3 = 60$.'],
      check: { q: 'How many 2-letter arrangements can be made from the letters of MATH?', options: ['$12$', '$24$', '$6$', '$16$'], answer: 0, why: '${}_4P_2 = 4 \\times 3 = 12$.' },
    },
  ],

  'PCBT2.constraints': [
    {
      say: '**Together**: glue the objects that must be together into one **block**. Then arrange the block with everything else, as if it were one object.',
      example: ['MATHS with M and A together.', 'Block [MA], plus T, H, S: 4 units.', 'Arrange 4 units: $4! = 24$.'],
      check: { q: '6 people line up, and 2 of them must stand together. How many units do you arrange?', options: ['$5$', '$6$', '$4$', '$2$'], answer: 0, why: 'The pair becomes one block, so you arrange the block and 4 others: 5 units.' },
    },
    {
      say: 'Do not forget the inside of the block. The objects in the block can swap places too, so multiply by their arrangements.',
      example: ['[MA] can be MA or AM: $2! = 2$.', 'Total: $4! \\times 2! = 24 \\times 2 = 48$.'],
      check: { q: '5 people line up, and Ann, Bo and Cy must stand together. How many ways?', options: ['$36$', '$6$', '$12$', '$720$'], answer: 0, why: 'The block and 2 others are 3 units: $3! = 6$. Inside the block: $3! = 6$. $6 \\times 6 = 36$.' },
    },
    {
      say: '**Apart** means not together. Count all the arrangements, then subtract the ones where they are together.',
      example: ['MATHS with M and A apart.', 'All: $5! = 120$.', 'Together: $48$.', 'Apart: $120 - 48 = 72$.'],
      check: { q: '4 people line up, and Ann and Bo refuse to stand together. How many ways?', options: ['$12$', '$24$', '$6$', '$18$'], answer: 0, why: 'All: $4! = 24$. Together: $3! \\times 2! = 12$. Apart: $24 - 12 = 12$.' },
    },
    {
      say: 'The same steps work for letters. To keep two vowels apart, count all the arrangements, then subtract those with the vowels together.',
      example: ['PLANET: 6 letters, vowels A and E.', 'All: $6! = 720$.', 'Together: $5! \\times 2! = 240$.', 'Apart: $720 - 240 = 480$.'],
      check: { q: 'How many arrangements of PLANE have the two vowels apart?', options: ['$72$', '$48$', '$96$', '$120$'], answer: 0, why: 'All: $5! = 120$. Together: $4! \\times 2! = 48$. Apart: $120 - 48 = 72$.' },
    },
    {
      say: 'For a **fixed position**, such as "starts with a consonant", fill that box first. Then arrange everything else in the boxes that are left.',
      example: ['MATHS starting with a consonant.', 'Consonants M, T, H, S: 4 choices for box 1.', 'The other 4 letters: $4! = 24$.', '$4 \\times 24 = 96$'],
      check: { q: 'How many arrangements of PLANE start with a vowel?', options: ['$48$', '$24$', '$120$', '$72$'], answer: 0, why: 'A or E first: 2 choices. Then $4! = 24$ for the rest. $2 \\times 24 = 48$.' },
    },
    {
      say: 'For **both ends**, fill the first and last boxes first. If the rule needs more objects than you have, the answer is 0.',
      example: ['PLANE begins and ends with a vowel.', 'First: A or E, so 2. Last: the other vowel, so 1.', 'Middle 3 letters: $3! = 6$.', '$2 \\times 1 \\times 6 = 12$'],
      check: { q: 'How many arrangements of MATHS begin and end with a vowel?', options: ['$0$', '$6$', '$12$', '$24$'], answer: 0, why: 'MATHS has only one vowel, A. It cannot be at both ends.' },
    },
  ],

  'PCBT2.repeated': [
    {
      say: 'If some objects are **identical** (exactly alike), swapping them does not make a new arrangement. So $n!$ counts too many.',
      example: ['Arrange the letters of EE.', '$2! = 2$ counts $E_1E_2$ and $E_2E_1$.', 'Both look like EE, so there is really only 1.'],
      check: { q: 'How many different arrangements does AAB have?', options: ['$3$', '$6$', '$2$', '$1$'], answer: 0, why: 'AAB, ABA and BAA. That is $\\frac{3!}{2!} = 3$.' },
    },
    {
      say: 'Divide by the factorial of each repeat count. For $n$ objects with $a$ alike and $b$ alike, the count is $\\frac{n!}{a!\\,b!}$.',
      example: ['LEVEL: 5 letters.', 'L appears 2 times. E appears 2 times.', '$\\frac{5!}{2!\\,2!} = \\frac{120}{4} = 30$'],
      check: { q: 'How many arrangements of BANANA are there?', options: ['$60$', '$720$', '$120$', '$360$'], answer: 0, why: 'A appears 3 times and N 2 times: $\\frac{6!}{3!\\,2!} = \\frac{720}{12} = 60$.' },
    },
    {
      say: 'Letters that appear only once do not change the count, since $1! = 1$. Count each letter carefully before you start.',
      example: ['COFFEE: C once, O once, F twice, E twice.', '$\\frac{6!}{2!\\,2!} = \\frac{720}{4} = 180$'],
      check: { q: 'How many arrangements of PEPPER are there?', options: ['$60$', '$120$', '$180$', '$720$'], answer: 0, why: 'P appears 3 times and E 2 times: $\\frac{6!}{3!\\,2!} = \\frac{720}{12} = 60$.' },
    },
    {
      say: '**Grid paths** are repeated-letter problems. A shortest path 4 blocks east and 3 blocks south is an arrangement of 4 E moves and 3 S moves.',
      example: ['Moves: E E E E S S S, 7 moves in all.', '$\\frac{7!}{4!\\,3!}$', '$= \\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = \\frac{210}{6} = 35$'],
      check: { q: 'B is 2 blocks east and 2 blocks south of A. How many shortest paths go from A to B?', options: ['$6$', '$24$', '$4$', '$16$'], answer: 0, why: 'Arrange E E S S: $\\frac{4!}{2!\\,2!} = \\frac{24}{4} = 6$.' },
    },
    {
      say: 'A path that must pass through a point C has two legs: A to C, then C to B. Count each leg and multiply.',
      example: ['B is 3 east, 2 south of A. C is 1 east, 1 south of A.', 'A to C: E S, so $\\frac{2!}{1!\\,1!} = 2$.', 'C to B: 2 east, 1 south, so $\\frac{3!}{2!\\,1!} = 3$.', '$2 \\times 3 = 6$ paths.'],
      check: { q: 'There are 3 paths from A to C and 4 paths from C to B. How many paths go from A to B through C?', options: ['$12$', '$7$', '$1$', '$64$'], answer: 0, why: 'A to C **and** C to B, so multiply: $3 \\times 4 = 12$.' },
    },
    {
      say: 'If a letter is fixed in a spot, place it first. Then arrange the letters that are left, dividing by their repeats.',
      example: ['LEVEL starting with L.', 'Put an L first. Left: E, V, E, L.', 'E appears twice: $\\frac{4!}{2!} = \\frac{24}{2} = 12$.'],
      check: { q: 'How many arrangements of BANANA begin with B?', options: ['$10$', '$60$', '$120$', '$20$'], answer: 0, why: 'After B, arrange A, N, A, N, A: $\\frac{5!}{3!\\,2!} = \\frac{120}{12} = 10$.' },
    },
  ],

  'PCBT2.cases': [
    {
      say: 'Sometimes one box changes how many choices another box has. Then split the problem into **cases**, so each case has fixed numbers. Count each case, then add.',
      example: ['Even 3-digit numbers from the digits 0 to 5, no repeats.', 'The last digit must be 0, 2 or 4.', 'The first digit cannot be 0.', 'Whether 0 is used at the end changes the first box, so split.'],
      check: { q: 'Why does the digit 0 cause trouble in number problems?', options: ['A number cannot start with 0', '0 is not even', '0 cannot be repeated', '0 is not a digit'], answer: 0, why: 'A leading 0 makes the number shorter, so the first box can never hold 0.' },
    },
    {
      say: 'Case 1: the last digit is 0. Fill the last box first, then the first box, then the middle.',
      example: ['Last: 0, so 1 choice.', 'First: 1 to 5, so 5 choices.', 'Middle: 4 digits left.', '$5 \\times 4 \\times 1 = 20$'],
      check: { q: 'Using 0 to 5 with no repeats, how many 2-digit numbers end in 0?', options: ['$5$', '$4$', '$6$', '$10$'], answer: 0, why: 'The last box holds 0. The first box can be any of 1 to 5: 5 numbers.' },
    },
    {
      say: 'Case 2: the last digit is 2 or 4. Now the first box cannot hold 0 **or** the digit already used at the end.',
      example: ['Last: 2 or 4, so 2 choices.', 'First: 6 digits minus 0 and minus the last digit: 4 choices.', 'Middle: 6 digits minus the 2 used: 4 choices.', '$4 \\times 4 \\times 2 = 32$'],
      check: { q: 'Using 0 to 5 with no repeats, how many 2-digit numbers end in 2 or 4?', options: ['$8$', '$10$', '$12$', '$6$'], answer: 0, why: 'Last: 2 choices. First: not 0 and not the last digit, so 4. $4 \\times 2 = 8$.' },
    },
    {
      say: 'Add the cases, because each number falls in one case **or** the other, never both.',
      example: ['Case 1: $20$.', 'Case 2: $32$.', 'Total: $20 + 32 = 52$.'],
      check: { q: 'Case A has 15 ways and case B has 8 ways. They cannot both happen. What is the total?', options: ['$23$', '$120$', '$7$'], answer: 0, why: 'Separate cases are joined by "or", so add: $15 + 8 = 23$.' },
    },
    {
      say: 'Cases must **not overlap**, and together they must cover everything. If two conditions can both be true, add them, then subtract the overlap once.',
      example: ['PLANE begins or ends with a vowel.', 'Begins with a vowel: $2 \\times 4! = 48$. Ends with a vowel: also $48$.', 'Both: $2 \\times 1 \\times 3! = 12$.', '$48 + 48 - 12 = 84$'],
      check: { q: 'Condition A has 30 ways, B has 30 ways, and 10 ways meet both. How many meet A or B?', options: ['$50$', '$60$', '$70$', '$40$'], answer: 0, why: '$30 + 30 = 60$ counts the 10 shared ways twice. Subtract them once: $60 - 10 = 50$.' },
    },
    {
      say: 'With three rules at once, place the most restricted object first, glue any blocks, then arrange the rest.',
      example: ['5 people. Ann and Bo together. Cy at one end.', 'Cy: 2 ends.', 'Block [Ann Bo] and the 2 others: $3! = 6$.', 'Inside the block: $2! = 2$.', '$2 \\times 6 \\times 2 = 24$'],
      check: { q: '4 people line up. Ann and Bo must be together, and Cy must be at one end. How many ways?', options: ['$8$', '$4$', '$12$', '$24$'], answer: 0, why: 'Cy: 2 ends. The block and 1 other: $2! = 2$. Inside: $2! = 2$. $2 \\times 2 \\times 2 = 8$.' },
    },
    {
      say: 'Cases also handle lengths that change, such as "codes of up to 3 letters". Count each length on its own, then add.',
      example: ['Codes of 1, 2 or 3 letters from A, B, C, D, no repeats.', '1 letter: $4$.', '2 letters: $4 \\times 3 = 12$.', '3 letters: $4 \\times 3 \\times 2 = 24$.', '$4 + 12 + 24 = 40$'],
      check: { q: 'How many 1-digit or 2-digit codes can be made from the digits 1 to 5 with no repeats?', options: ['$25$', '$100$', '$20$', '$30$'], answer: 0, why: 'One digit: 5. Two digits: $5 \\times 4 = 20$. Add: $5 + 20 = 25$.' },
    },
  ],

  'PCBT2.solve-n': [
    {
      say: 'Before you solve for $n$, write the **restriction**. In ${}_nP_r$ you need $n \\ge r$, and $n$ must be a natural number.',
      example: ['${}_nP_2 = 30$', 'Restriction: $n \\ge 2$ and $n \\in N$.'],
      check: { q: 'What restriction goes with ${}_nP_3 = 60$?', options: ['$n \\ge 3$', '$n \\ge 0$', '$n \\le 3$', '$n \\ge 60$'], answer: 0, why: 'You cannot arrange 3 objects from fewer than 3, so $n \\ge 3$.' },
    },
    {
      say: 'Next, write ${}_nP_r$ with factorials and cancel. ${}_nP_2$ becomes $n(n - 1)$.',
      example: ['${}_nP_2 = \\frac{n!}{(n - 2)!}$', '$= \\frac{n(n - 1)(n - 2)!}{(n - 2)!}$', '$= n(n - 1)$'],
      check: { q: 'What is ${}_nP_3$ after cancelling?', options: ['$n(n - 1)(n - 2)$', '$n(n - 1)$', '$3n$', '$n(n - 1)(n - 2)(n - 3)$'], answer: 0, why: 'It has 3 factors, starting at $n$ and counting down.' },
    },
    {
      say: 'Set it equal to the number, expand, and move everything to one side. Then factor the quadratic.',
      example: ['$n(n - 1) = 30$', '$n^2 - n = 30$', '$n^2 - n - 30 = 0$', '$(n - 6)(n + 5) = 0$', '$n = 6$ or $n = -5$'],
      check: { q: 'Factor $n^2 - n - 42 = 0$.', options: ['$(n - 7)(n + 6) = 0$', '$(n + 7)(n - 6) = 0$', '$(n - 21)(n + 2) = 0$', '$(n - 42)(n + 1) = 0$'], answer: 0, why: '$-7 \\times 6 = -42$ and $-7 + 6 = -1$.' },
    },
    {
      say: '**Reject** any root that is negative, not a whole number, or smaller than $r$. Then check your answer in the original equation.',
      example: ['$n = -5$ is negative, so reject it.', '$n = 6$: ${}_6P_2 = 6 \\times 5 = 30$. It works.'],
      check: { q: '${}_nP_2 = 56$ gives $(n - 8)(n + 7) = 0$. What is $n$?', options: ['$8$', '$-7$', '$8$ or $-7$', '$7$'], answer: 0, why: '$n$ must be a natural number, so reject $-7$. Check: $8 \\times 7 = 56$.' },
    },
    {
      say: 'For ${}_nP_3$ equal to a number, look for three whole numbers in a row that multiply to it. Estimate, then check.',
      example: ['${}_nP_3 = 120$', 'Try $n = 6$: $6 \\times 5 \\times 4 = 120$.', 'So $n = 6$.'],
      check: { q: 'Solve ${}_nP_3 = 336$.', options: ['$8$', '$7$', '$6$', '$9$'], answer: 0, why: '$8 \\times 7 \\times 6 = 336$, so $n = 8$.' },
    },
    {
      say: 'When both sides share factors, divide them out. This is safe because $n \\ge r$ makes those factors non-zero.',
      example: ['${}_nP_3 = 5\\,{}_nP_2$', '$n(n - 1)(n - 2) = 5n(n - 1)$', 'Divide both sides by $n(n - 1)$: $n - 2 = 5$.', '$n = 7$'],
      check: { q: 'Solve ${}_nP_3 = 4\\,{}_nP_2$.', options: ['$6$', '$4$', '$2$', '$8$'], answer: 0, why: '$n(n - 1)(n - 2) = 4n(n - 1)$, so $n - 2 = 4$ and $n = 6$.' },
    },
    {
      say: 'To solve for $r$, multiply down from $n$ until you reach the number. The number of factors you used is $r$.',
      example: ['${}_7P_r = 210$', '$7$, then $7 \\times 6 = 42$, then $7 \\times 6 \\times 5 = 210$.', 'Three factors, so $r = 3$.'],
      check: { q: 'Solve ${}_5P_r = 60$.', options: ['$3$', '$2$', '$4$', '$12$'], answer: 0, why: '$5 \\times 4 \\times 3 = 60$ uses 3 factors, so $r = 3$.' },
    },
  ],

  'PCBT3.ncr': [
    {
      say: 'A **combination** is a selection where order does **not** matter. Choosing Ann and Bo is the same group as choosing Bo and Ann.',
      example: ['Pick 2 of Ann, Bo and Cy for a team.', 'Teams: Ann and Bo, Ann and Cy, Bo and Cy.', 'Only 3 teams, even though ${}_3P_2 = 6$.'],
      check: { q: 'Which situation is a combination?', options: ['Choosing 4 toppings for a pizza', 'Giving out 1st, 2nd and 3rd prizes', 'Making a 4-digit PIN', 'Electing a president and a treasurer'], answer: 0, why: 'The same toppings in a different order make the same pizza.' },
    },
    {
      say: 'Each group of $r$ can be put in order $r!$ ways. So divide the permutations by $r!$: ${}_nC_r = \\frac{{}_nP_r}{r!}$.',
      example: ['Committees of 3 from 8 people.', '${}_8P_3 = 8 \\times 7 \\times 6 = 336$', 'Each committee was counted $3! = 6$ times.', '${}_8C_3 = \\frac{336}{6} = 56$'],
      check: { q: 'Evaluate ${}_5C_2$.', options: ['$10$', '$20$', '$5$', '$60$'], answer: 0, why: '${}_5P_2 = 20$. Divide by $2! = 2$ to get $10$.' },
    },
    {
      say: 'The full formula is ${}_nC_r = \\frac{n!}{(n - r)!\\,r!}$. You may also see it written as $\\binom{n}{r}$. Both mean the same thing.',
      example: ['$\\binom{6}{2} = \\frac{6!}{4!\\,2!}$', '$= \\frac{6 \\times 5}{2 \\times 1}$', '$= 15$'],
      check: { q: 'Evaluate $\\binom{7}{3}$.', options: ['$35$', '$210$', '$21$', '$70$'], answer: 0, why: '$\\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = \\frac{210}{6} = 35$.' },
    },
    {
      say: '**Symmetry**: ${}_nC_r = {}_nC_{n - r}$. Choosing 3 of 8 people to take is the same as choosing the 5 to leave behind.',
      example: ['${}_8C_5 = {}_8C_3$', '$= \\frac{8 \\times 7 \\times 6}{3!} = \\frac{336}{6} = 56$'],
      check: { q: 'Which has the same value as ${}_{10}C_7$?', options: ['${}_{10}C_3$', '${}_{10}C_{17}$', '${}_{10}C_4$', '${}_{10}P_3$'], answer: 0, why: '$10 - 7 = 3$, so ${}_{10}C_7 = {}_{10}C_3$.' },
    },
    {
      say: 'Ask: if I swap two chosen items, is it a new outcome? Yes means **permutation** (titles, codes, prizes). No means **combination** (committees, hands, toppings).',
      example: ['Give 3 different prizes to 3 of 10 people: ${}_{10}P_3$.', 'Choose 3 of 10 people for a team: ${}_{10}C_3$.'],
      check: { q: 'Which counts the ways to deal a 5-card hand from 52 cards?', options: ['${}_{52}C_5$', '${}_{52}P_5$', '$52^5$', '$52!$'], answer: 0, why: 'A hand is the same no matter what order the cards came in.' },
    },
    {
      say: 'To choose from **two groups**, choose from each group, then multiply. You choose from the first group **and** the second.',
      example: ['2 teachers from 5 and 3 students from 10.', 'Teachers: ${}_5C_2 = 10$.', 'Students: ${}_{10}C_3 = 120$.', '$10 \\times 120 = 1200$'],
      check: { q: 'Choose 1 boy from 4 and 2 girls from 5. How many groups are possible?', options: ['$40$', '$14$', '$84$', '$80$'], answer: 0, why: '${}_4C_1 \\times {}_5C_2 = 4 \\times 10 = 40$.' },
    },
    {
      say: 'If one person must be on the committee, put them on first, then choose the rest from the others. If they must be left out, choose everyone from the others.',
      example: ['Committee of 3 from 8 people, Dee included.', 'Dee takes 1 seat. Choose 2 from the other 7.', '${}_7C_2 = 21$', 'Dee left out: ${}_7C_3 = 35$.'],
      check: { q: 'A committee of 3 is chosen from 6 people. How many committees include Sam?', options: ['$10$', '$20$', '$15$', '$5$'], answer: 0, why: 'Sam is in. Choose 2 more from the other 5: ${}_5C_2 = 10$.' },
    },
  ],

  'PCBT3.at-least': [
    {
      say: '"**At least** 2" means 2 or more. "**At most** 2" means 2 or fewer, and that includes 0.',
      example: ['Committee of 3. At least 2 women: 2 or 3 women.', 'At most 1 woman: 0 or 1 woman.'],
      check: { q: 'A team of 4 has at most 1 girl. Which numbers of girls are allowed?', options: ['0 or 1', '1 only', '1, 2, 3 or 4', '0, 1 or 2'], answer: 0, why: '"At most 1" means 1 or fewer, and that includes 0.' },
    },
    {
      say: 'For one exact case, choose from each group and multiply. Exactly 2 women from 4 and 1 man from 5 is ${}_4C_2 \\times {}_5C_1$.',
      example: ['${}_4C_2 = 6$', '${}_5C_1 = 5$', '$6 \\times 5 = 30$'],
      check: { q: 'From 3 girls and 4 boys, how many groups of 3 have exactly 1 girl?', options: ['$18$', '$7$', '$35$', '$9$'], answer: 0, why: '1 girl: ${}_3C_1 = 3$. 2 boys: ${}_4C_2 = 6$. $3 \\times 6 = 18$.' },
    },
    {
      say: 'The **direct method**: list every allowed case, count each one, and add.',
      example: ['3 from 4 women and 5 men, at least 2 women.', '2 women: ${}_4C_2 \\times {}_5C_1 = 6 \\times 5 = 30$.', '3 women: ${}_4C_3 \\times {}_5C_0 = 4 \\times 1 = 4$.', '$30 + 4 = 34$'],
      check: { q: 'From 3 girls and 4 boys, how many groups of 2 have at least 1 girl?', options: ['$15$', '$12$', '$3$', '$21$'], answer: 0, why: '1 girl: $3 \\times 4 = 12$. 2 girls: ${}_3C_2 = 3$. $12 + 3 = 15$.' },
    },
    {
      say: 'The **indirect method**: count all selections, then subtract the ones that break the rule. It is fastest for "at least one".',
      example: ['3 from 4 women and 5 men, at least 1 woman.', 'All: ${}_9C_3 = 84$.', 'No women: ${}_5C_3 = 10$.', '$84 - 10 = 74$'],
      check: { q: 'From 2 teachers and 5 parents, how many groups of 3 include at least 1 teacher?', options: ['$25$', '$35$', '$10$', '$45$'], answer: 0, why: 'All: ${}_7C_3 = 35$. No teachers: ${}_5C_3 = 10$. $35 - 10 = 25$.' },
    },
    {
      say: 'A common mistake: picking one woman first, then any 2 from the rest. This counts some committees **twice**, so the answer comes out too big.',
      example: ['Wrong: ${}_4C_1 \\times {}_8C_2 = 4 \\times 28 = 112$.', 'Right: $74$.', 'The committee Ann, Bea, Cal (two women) is counted once with Ann picked first and again with Bea picked first.'],
      check: { q: 'Why is ${}_4C_1 \\times {}_8C_2$ wrong for "at least one woman"?', options: ['It counts some groups more than once', 'It leaves out the men', 'It should add, not multiply', 'Order should matter'], answer: 0, why: 'A group with 2 women is counted once for each woman picked first.' },
    },
    {
      say: '"At most" works the same way. List the small cases, starting at 0, and add.',
      example: ['3 from 5 girls and 4 boys, at most 1 girl.', '0 girls: ${}_4C_3 = 4$.', '1 girl: ${}_5C_1 \\times {}_4C_2 = 5 \\times 6 = 30$.', '$4 + 30 = 34$'],
      check: { q: 'From 4 girls and 3 boys, how many groups of 3 have at most 1 girl?', options: ['$13$', '$12$', '$35$', '$1$'], answer: 0, why: '0 girls: ${}_3C_3 = 1$. 1 girl: ${}_4C_1 \\times {}_3C_2 = 4 \\times 3 = 12$. $1 + 12 = 13$.' },
    },
    {
      say: 'Card questions work the same way. A standard deck has 52 cards: 4 suits of 13, with 4 aces, 12 face cards and 26 red cards.',
      example: ['3-card hands with at least one ace.', 'All hands: ${}_{52}C_3$.', 'No aces: ${}_{48}C_3$.', 'Answer: ${}_{52}C_3 - {}_{48}C_3$.'],
      check: { q: 'Which counts 5-card hands with exactly 2 hearts?', options: ['${}_{13}C_2 \\times {}_{39}C_3$', '${}_{13}C_2 \\times {}_{52}C_3$', '${}_{13}C_2 + {}_{39}C_3$', '${}_{52}C_5 - {}_{39}C_5$'], answer: 0, why: '2 hearts from 13 and the other 3 cards from the 39 non-hearts, then multiply.' },
    },
  ],

  'PCBT3.mixed': [
    {
      say: 'Many problems have two stages: **choose** which objects (order does not matter), then **arrange** them (order matters). Multiply the stages.',
      example: ['Choose 3 of 7 books, then line them up.', 'Choose: ${}_7C_3 = 35$.', 'Arrange: $3! = 6$.', '$35 \\times 6 = 210$'],
      check: { q: 'Choose 2 of 5 paintings and hang them in a row. How many ways?', options: ['$20$', '$10$', '$120$', '$7$'], answer: 0, why: '${}_5C_2 = 10$ choices, then $2! = 2$ orders: $10 \\times 2 = 20$.' },
    },
    {
      say: 'Choosing $r$ and then arranging all $r$ gives the same answer as a permutation: ${}_nC_r \\times r! = {}_nP_r$. This is a good check.',
      example: ['${}_7C_3 \\times 3! = 35 \\times 6 = 210$', '${}_7P_3 = 7 \\times 6 \\times 5 = 210$'],
      check: { q: 'Which is equal to ${}_6C_2 \\times 2!$?', options: ['${}_6P_2$', '${}_6C_2$', '$6!$', '${}_6P_4$'], answer: 0, why: 'Choosing 2 and then ordering them is the same as arranging 2 of 6.' },
    },
    {
      say: 'To choose from two groups and then arrange, choose from each group and multiply. Then multiply by the arrangements of **all** the chosen objects together.',
      example: ['2 vowels from 3 and 2 consonants from 5, made into 4-letter arrangements.', 'Choose: ${}_3C_2 \\times {}_5C_2 = 3 \\times 10 = 30$.', 'Arrange all 4 letters: $4! = 24$.', '$30 \\times 24 = 720$'],
      check: { q: 'How many 3-letter arrangements use 2 consonants from 4 and 1 vowel from 2?', options: ['$72$', '$12$', '$24$', '$36$'], answer: 0, why: 'Choose: ${}_4C_2 \\times {}_2C_1 = 6 \\times 2 = 12$. Arrange: $3! = 6$. $12 \\times 6 = 72$.' },
    },
    {
      say: 'For **roles** inside a group, choose the group first, then hand out the jobs. One job (a chair) has $r$ choices. Two different jobs give ${}_rP_2$.',
      example: ['A committee of 5 from 9, then a chair.', 'Committee: ${}_9C_5 = 126$.', 'Chair: 5 choices.', '$126 \\times 5 = 630$'],
      check: { q: 'A committee of 4 is chosen from 6 people, then a chair and a secretary are named. How many ways?', options: ['$180$', '$90$', '$60$', '$360$'], answer: 0, why: '${}_6C_4 = 15$. Chair and secretary: ${}_4P_2 = 12$. $15 \\times 12 = 180$.' },
    },
    {
      say: 'Test each stage with one question: if you swap two chosen objects, is it a different outcome? Yes: use $P$ or $!$. No: use $C$.',
      example: ['Picking 4 players for a team: swapping gives the same team, so $C$.', 'Giving them batting spots 1 to 4: swapping changes things, so $4!$.'],
      check: { q: 'From 10 players, pick 5 starters, then pick a captain from the starters. Which expression counts this?', options: ['${}_{10}C_5 \\times 5$', '${}_{10}P_5 \\times 5$', '${}_{10}C_5 + 5$', '${}_{10}C_5$'], answer: 0, why: 'Starters are a group, so use $C$. The captain is one of the 5, so multiply by 5.' },
    },
    {
      say: 'Join stages with "and" by multiplying. Join separate cases with "or" by adding. Big problems are these steps stacked together.',
      example: ['A team of 3 from 4 girls and 3 boys, at least 2 girls, then a captain.', '2 girls: ${}_4C_2 \\times {}_3C_1 = 6 \\times 3 = 18$. 3 girls: ${}_4C_3 = 4$.', 'Teams: $18 + 4 = 22$.', 'Captain: $22 \\times 3 = 66$.'],
      check: { q: 'Case A gives 10 teams and case B gives 5 teams. Each team then picks a captain from its 3 members. Total?', options: ['$45$', '$18$', '$150$', '$30$'], answer: 0, why: 'Cases add: $10 + 5 = 15$. Then multiply by 3 captains: $15 \\times 3 = 45$.' },
    },
  ],

  'PCBT3.solve-n': [
    {
      say: 'For ${}_nC_r$ equations the restriction is the same as before: $n \\ge r$ and $n$ is a natural number. Write it down first.',
      example: ['${}_nC_2 = 28$', 'Restriction: $n \\ge 2$ and $n \\in N$.'],
      check: { q: 'What restriction goes with ${}_nC_4 = 15$?', options: ['$n \\ge 4$', '$n \\ge 15$', '$n \\le 4$', '$n \\ge 0$'], answer: 0, why: 'You cannot choose 4 from fewer than 4, so $n \\ge 4$.' },
    },
    {
      say: 'Write ${}_nC_2$ with factorials and cancel. It becomes $\\frac{n(n - 1)}{2}$.',
      example: ['${}_nC_2 = \\frac{n!}{(n - 2)!\\,2!}$', '$= \\frac{n(n - 1)(n - 2)!}{(n - 2)!\\,2!}$', '$= \\frac{n(n - 1)}{2}$'],
      check: { q: 'What is ${}_nC_3$ after cancelling?', options: ['$\\frac{n(n - 1)(n - 2)}{6}$', '$n(n - 1)(n - 2)$', '$\\frac{n(n - 1)}{3}$', '$\\frac{n(n - 1)(n - 2)}{3}$'], answer: 0, why: '${}_nP_3 = n(n - 1)(n - 2)$, then divide by $3! = 6$.' },
    },
    {
      say: 'Multiply both sides by the bottom number to clear the fraction. Then expand, set it equal to 0, and factor.',
      example: ['$\\frac{n(n - 1)}{2} = 28$', '$n(n - 1) = 56$', '$n^2 - n - 56 = 0$', '$(n - 8)(n + 7) = 0$', 'Reject $-7$, so $n = 8$.'],
      check: { q: 'Solve ${}_nC_2 = 15$.', options: ['$6$', '$-5$', '$5$', '$30$'], answer: 0, why: '$n(n - 1) = 30$ gives $(n - 6)(n + 5) = 0$. Reject $-5$, so $n = 6$.' },
    },
    {
      say: 'If the top number is $n + 1$ instead of $n$, solve the same way. The two factors are now $(n + 1)$ and $n$.',
      example: ['${}_{n + 1}C_2 = 10$', '$\\frac{(n + 1)n}{2} = 10$, so $n^2 + n = 20$.', '$n^2 + n - 20 = 0$', '$(n + 5)(n - 4) = 0$, so $n = 4$.'],
      check: { q: 'Solve ${}_{n + 1}C_2 = 21$.', options: ['$6$', '$7$', '$-7$', '$5$'], answer: 0, why: '$(n + 1)n = 42$ gives $(n + 7)(n - 6) = 0$, so $n = 6$. Careful: $7$ is $n + 1$, not $n$.' },
    },
    {
      say: 'When both sides share a factor, divide it out. A big equation then becomes a small one.',
      example: ['${}_nC_2 = 3\\,{}_nC_1$', '$\\frac{n(n - 1)}{2} = 3n$', 'Divide by $n$: $\\frac{n - 1}{2} = 3$.', '$n - 1 = 6$, so $n = 7$.'],
      check: { q: 'Solve ${}_nC_2 = 4\\,{}_nC_1$.', options: ['$9$', '$8$', '$5$', '$4$'], answer: 0, why: 'Divide by $n$: $\\frac{n - 1}{2} = 4$, so $n - 1 = 8$ and $n = 9$.' },
    },
    {
      say: '**Handshakes**: if $n$ people each shake hands once with everyone else, there are ${}_nC_2$ handshakes, because each handshake is a pair.',
      example: ['45 handshakes. How many people?', '$\\frac{n(n - 1)}{2} = 45$', '$n(n - 1) = 90$', '$10 \\times 9 = 90$, so $n = 10$.'],
      check: { q: 'At a meeting there were 6 handshakes, one for each pair. How many people were there?', options: ['$4$', '$6$', '$3$', '$12$'], answer: 0, why: '${}_4C_2 = \\frac{4 \\times 3}{2} = 6$.' },
    },
    {
      say: 'To solve for $r$, use symmetry. If one value of $r$ works, then $n - r$ works too.',
      example: ['${}_{10}C_r = 45$', '${}_{10}C_2 = \\frac{10 \\times 9}{2} = 45$, so $r = 2$.', 'Symmetry: $r = 10 - 2 = 8$ also works.'],
      check: { q: 'Solve ${}_6C_r = 15$.', options: ['$r = 2$ or $r = 4$', '$r = 2$ only', '$r = 3$', '$r = 4$ only'], answer: 0, why: '${}_6C_2 = 15$, and by symmetry ${}_6C_4 = 15$ too.' },
    },
  ],

  'PCBT4.pascal': [
    {
      say: '**Pascal\'s triangle** starts with 1 at the top. Each row starts and ends with 1. Every other number is the **sum of the two numbers above it**.',
      example: ['Row: $1, 3, 3, 1$', 'Next row: $1,\\ 1 + 3,\\ 3 + 3,\\ 3 + 1,\\ 1$', '$= 1, 4, 6, 4, 1$'],
      check: { q: 'Two numbers side by side in a row are 10 and 5. What number sits below, between them?', options: ['$15$', '$50$', '$5$', '$10$'], answer: 0, why: 'Each number is the sum of the two above it: $10 + 5 = 15$.' },
    },
    {
      say: 'Name a row by its second number. The row that begins $1, n$ goes with the power $n$, and it has $n + 1$ numbers.',
      example: ['$1, 4, 6, 4, 1$ begins $1, 4$.', 'So it is the row for power 4.', 'It has $4 + 1 = 5$ numbers.'],
      check: { q: 'How many numbers are in the row that begins $1, 7$?', options: ['$8$', '$7$', '$14$', '$6$'], answer: 0, why: 'The row for power 7 has $7 + 1 = 8$ numbers.' },
    },
    {
      say: 'Watch the row numbering. Some books call the top 1 **row 0**, others call it **row 1**. With row 1 at the top, the row that begins $1, n$ is row $n + 1$.',
      example: ['Top 1 is row 1.', '$1, 1$ is row 2.', '$1, 2, 1$ is row 3.', 'So $1, 4, 6, 4, 1$ is row 5.'],
      check: { q: 'Row 1 is the single 1 at the top. Which row gives the coefficients of $(a + b)^6$?', options: ['Row 7', 'Row 6', 'Row 5', 'Row 12'], answer: 0, why: 'Power 6 uses the row beginning $1, 6$. Counting the top as row 1, that is row 7.' },
    },
    {
      say: 'The row that begins $1, n$ is ${}_nC_0, {}_nC_1, \\ldots, {}_nC_n$, the coefficients of $(a + b)^n$. Find any entry with ${}_nC_r$, counting from $r = 0$.',
      example: ['Row beginning $1, 5$: the 3rd number.', 'Counting from 0, it is $r = 2$.', '${}_5C_2 = \\frac{5 \\times 4}{2} = 10$', 'Row: $1, 5, 10, 10, 5, 1$.'],
      check: { q: 'A row begins $1, 6$. What is its 3rd number?', options: ['$15$', '$20$', '$6$', '$12$'], answer: 0, why: 'The 3rd number has $r = 2$: ${}_6C_2 = \\frac{6 \\times 5}{2} = 15$.' },
    },
    {
      say: 'The rows are **symmetric**: they read the same forward and backward, because ${}_nC_r = {}_nC_{n - r}$.',
      example: ['$1, 5, 10, 10, 5, 1$', '${}_5C_1 = {}_5C_4 = 5$', '${}_5C_2 = {}_5C_3 = 10$'],
      check: { q: 'A row is $1, 7, 21, 35, \\ldots$ What is its second-last number?', options: ['$7$', '$1$', '$35$', '$21$'], answer: 0, why: 'The row reads the same backward, so the second-last number matches the second: 7.' },
    },
    {
      say: 'The numbers in the row that begins $1, n$ add up to $2^n$.',
      example: ['$1 + 4 + 6 + 4 + 1 = 16$', '$2^4 = 16$'],
      check: { q: 'What is the sum of the row that begins $1, 6$?', options: ['$64$', '$36$', '$32$', '$12$'], answer: 0, why: 'The sum is $2^6 = 64$.' },
    },
    {
      say: '**Pascal\'s identity** writes the adding rule in symbols: ${}_nC_r = {}_{n-1}C_{r-1} + {}_{n-1}C_r$. Each entry is the two entries above it, added.',
      example: ['${}_5C_2 = {}_4C_1 + {}_4C_2$', '$= 4 + 6$', '$= 10$'],
      check: { q: 'Which is equal to ${}_7C_3$?', options: ['${}_6C_2 + {}_6C_3$', '${}_6C_2 + {}_6C_4$', '${}_7C_2 + {}_7C_4$', '${}_6C_2 \\times {}_6C_3$'], answer: 0, why: 'By the identity, ${}_7C_3 = {}_6C_2 + {}_6C_3 = 15 + 20 = 35$.' },
    },
  ],

  'PCBT4.expand': [
    {
      say: 'A **binomial** has two terms, like $x + y$. To expand $(x + y)^n$, take the coefficients from the row of Pascal\'s triangle that begins $1, n$.',
      example: ['$(x + y)^3$ uses the row $1, 3, 3, 1$.', 'So the coefficients are $1, 3, 3, 1$.'],
      check: { q: 'Which row gives the coefficients of $(a + b)^4$?', options: ['$1, 4, 6, 4, 1$', '$1, 3, 3, 1$', '$1, 4, 4, 1$', '$1, 5, 10, 10, 5, 1$'], answer: 0, why: 'Power 4 uses the row that begins $1, 4$.' },
    },
    {
      say: 'The powers follow a pattern. Powers of $x$ count **down** from $n$ to 0. Powers of $y$ count **up** from 0 to $n$. In each term they add to $n$.',
      example: ['$(x + y)^3$', '$= 1x^3 + 3x^2y + 3xy^2 + 1y^3$', 'Powers in each term: $3 + 0$, $2 + 1$, $1 + 2$, $0 + 3$.'],
      check: { q: 'Which term could appear in the expansion of $(x + y)^5$?', options: ['$10x^2y^3$', '$10x^2y^2$', '$10x^3y^3$', '$5x^5y$'], answer: 0, why: 'The powers in each term must add to 5, and $2 + 3 = 5$.' },
    },
    {
      say: 'The expansion has $n + 1$ terms, one more than the power.',
      example: ['$(x + y)^3$ has 4 terms.', '$(x + y)^8$ has $8 + 1 = 9$ terms.'],
      check: { q: 'How many terms are in the expansion of $(x + y)^{10}$?', options: ['$11$', '$10$', '$20$', '$9$'], answer: 0, why: 'There are $n + 1 = 11$ terms.' },
    },
    {
      say: 'In symbols this is the **binomial theorem**: $(x + y)^n = \\sum_{k=0}^{n} {}_nC_k\\, x^{n - k} y^k$. The $\\sum$ means add up the terms for $k = 0, 1, \\ldots, n$.',
      example: ['$(x + y)^2$', '$k = 0$: ${}_2C_0\\, x^2 y^0 = x^2$', '$k = 1$: ${}_2C_1\\, x^1 y^1 = 2xy$', '$k = 2$: ${}_2C_2\\, x^0 y^2 = y^2$', 'Sum: $x^2 + 2xy + y^2$'],
      check: { q: 'In the expansion of $(x + y)^4$, what is the term for $k = 1$?', options: ['$4x^3y$', '$4xy^3$', '$x^3y$', '$6x^2y^2$'], answer: 0, why: '${}_4C_1\\, x^3 y^1 = 4x^3y$.' },
    },
    {
      say: 'If a term has a number in it, like $2x$, put **brackets** around the whole term before you raise it to a power. The number gets the power too.',
      example: ['$(2x + 1)^2$', '$= (2x)^2 + 2(2x)(1) + (1)^2$', '$= 4x^2 + 4x + 1$'],
      check: { q: 'What is $(3x)^2$?', options: ['$9x^2$', '$3x^2$', '$6x^2$', '$9x$'], answer: 0, why: 'Both the 3 and the $x$ are squared: $3^2x^2 = 9x^2$.' },
    },
    {
      say: 'If the second term is negative, keep the minus sign inside its brackets. Odd powers of a negative stay negative, so the signs **alternate**.',
      example: ['$(2x - 3)^3$', '$= (2x)^3 + 3(2x)^2(-3) + 3(2x)(-3)^2 + (-3)^3$', '$= 8x^3 + 3(4x^2)(-3) + 3(2x)(9) - 27$', '$= 8x^3 - 36x^2 + 54x - 27$'],
      check: { q: 'What is the sign pattern of the expansion of $(x - 1)^4$?', options: ['$+, -, +, -, +$', '$+, +, +, +, +$', '$-, +, -, +, -$', '$+, -, -, -, +$'], answer: 0, why: 'The powers of $-1$ go 0, 1, 2, 3, 4, so the signs alternate, starting with $+$.' },
    },
    {
      say: 'To find one coefficient, you do not need the whole expansion. Find the term with the power you want and multiply out its numbers.',
      example: ['Coefficient of $x$ in $(x + 2)^3$.', 'The $x$ term is $3(x)(2)^2$.', '$= 3 \\times 4 \\times x = 12x$', 'The coefficient is $12$.'],
      check: { q: 'What is the coefficient of $x^2$ in $(2x + 1)^3$?', options: ['$12$', '$3$', '$6$', '$8$'], answer: 0, why: 'The $x^2$ term is $3(2x)^2(1) = 3(4x^2) = 12x^2$.' },
    },
    {
      say: 'Check an expansion by putting $x = 1$ into both sides. The two answers must match.',
      example: ['Check $(2x - 3)^3 = 8x^3 - 36x^2 + 54x - 27$.', 'Left: $(2(1) - 3)^3 = (-1)^3 = -1$.', 'Right: $8 - 36 + 54 - 27 = -1$.', 'They match.'],
      check: { q: 'For $(x + 1)^3 = x^3 + 3x^2 + 3x + 1$, what do both sides equal at $x = 1$?', options: ['$8$', '$4$', '$6$', '$1$'], answer: 0, why: '$(1 + 1)^3 = 8$, and $1 + 3 + 3 + 1 = 8$.' },
    },
  ],

  'PCBT4.general-term': [
    {
      say: 'The **general term** gives any one term without writing the whole expansion: $t_{k + 1} = {}_nC_k\\, x^{n - k} y^k$.',
      example: ['$(x + y)^5$, the term with $k = 2$:', '$t_3 = {}_5C_2\\, x^3 y^2$', '$= 10x^3y^2$'],
      check: { q: 'In $(x + y)^6$, what is $t_{k + 1}$ for $k = 1$?', options: ['$6x^5y$', '$6xy^5$', '$x^5y$', '$15x^4y^2$'], answer: 0, why: '${}_6C_1\\, x^5 y^1 = 6x^5y$.' },
    },
    {
      say: 'The term number is **one more** than $k$. For the 4th term, use $k = 3$.',
      example: ['1st term: $k = 0$.', '2nd term: $k = 1$.', '4th term: $k = 3$.'],
      check: { q: 'Which $k$ gives the 6th term?', options: ['$k = 5$', '$k = 6$', '$k = 7$', '$k = 4$'], answer: 0, why: 'The term number is $k + 1$, so $k + 1 = 6$ gives $k = 5$.' },
    },
    {
      say: 'Put each part in brackets with its number and sign. Then work out each bracket and multiply.',
      example: ['3rd term of $(x + 2)^5$, so $k = 2$.', '$t_3 = {}_5C_2 (x)^3 (2)^2$', '$= 10 \\times x^3 \\times 4$', '$= 40x^3$'],
      check: { q: 'What is the 2nd term of $(x + 3)^4$?', options: ['$12x^3$', '$4x^3$', '$54x^2$', '$108x$'], answer: 0, why: '$k = 1$: ${}_4C_1 (x)^3 (3)^1 = 4 \\times 3 \\times x^3 = 12x^3$.' },
    },
    {
      say: 'When only the second term is negative, the sign depends on $k$. Even $k$ gives a plus. Odd $k$ gives a minus.',
      example: ['3rd term of $(2x - 1)^6$, so $k = 2$.', '$t_3 = {}_6C_2 (2x)^4 (-1)^2$', '$= 15 \\times 16x^4 \\times 1$', '$= 240x^4$'],
      check: { q: 'What is the 2nd term of $(x - 2)^5$?', options: ['$-10x^4$', '$10x^4$', '$-2x^4$', '$40x^3$'], answer: 0, why: '$k = 1$: ${}_5C_1 (x)^4 (-2)^1 = 5 \\times (-2) \\times x^4 = -10x^4$.' },
    },
    {
      say: 'The **middle term**: when $n$ is even, there are $n + 1$ terms, an odd number, so one sits in the middle. It has $k = \\frac{n}{2}$. When $n$ is odd, there are two middle terms.',
      example: ['$(x + 2)^4$ has 5 terms, so the middle is $t_3$ with $k = 2$.', '$t_3 = {}_4C_2 (x)^2 (2)^2$', '$= 6 \\times x^2 \\times 4 = 24x^2$'],
      check: { q: 'Which term is the middle term of $(x + y)^8$?', options: ['$t_5$', '$t_4$', '$t_9$', '$t_8$'], answer: 0, why: 'There are 9 terms, with 4 on each side of $t_5$.' },
    },
    {
      say: 'To find the term with a certain power of $x$, set the power $n - k$ equal to it and solve for $k$.',
      example: ['Term with $x^2$ in $(x + 3)^5$.', '$5 - k = 2$, so $k = 3$.', '$t_4 = {}_5C_3 (x)^2 (3)^3$', '$= 10 \\times 27 \\times x^2 = 270x^2$'],
      check: { q: 'In $(x + y)^7$, which $k$ gives the term with $x^4$?', options: ['$k = 3$', '$k = 4$', '$k = 5$', '$k = 7$'], answer: 0, why: 'The power of $x$ is $7 - k = 4$, so $k = 3$.' },
    },
    {
      say: 'Counting from the end: in $(x + y)^n$, the $j$th term from the end is term number $n + 2 - j$ from the start.',
      example: ['$(x + y)^6$ has 7 terms.', 'The last term is the 7th, so the 2nd from the end is the 6th.', 'Formula: $6 + 2 - 2 = 6$.'],
      check: { q: 'In $(x + y)^9$, the 3rd term from the end is which term from the start?', options: ['The 8th', 'The 7th', 'The 3rd', 'The 9th'], answer: 0, why: '$9 + 2 - 3 = 8$. There are 10 terms, and counting back 10, 9, 8 lands on the 8th.' },
    },
  ],

  'PCBT4.nonlinear-term': [
    {
      say: 'First write every term as a power of $x$. A fraction like $\\frac{1}{x}$ becomes $x^{-1}$, and $\\frac{1}{x^2}$ becomes $x^{-2}$.',
      example: ['$\\frac{1}{x} = x^{-1}$', '$\\frac{3}{x^2} = 3x^{-2}$', '$\\sqrt{x} = x^{\\frac{1}{2}}$'],
      check: { q: 'Write $\\frac{2}{x^3}$ using a power of $x$.', options: ['$2x^{-3}$', '$2x^3$', '$-2x^3$', '$x^{-6}$'], answer: 0, why: 'Dividing by $x^3$ is the same as multiplying by $x^{-3}$.' },
    },
    {
      say: 'A power of a power **multiplies** the exponents: $(x^p)^m = x^{pm}$. When you multiply two powers of $x$, you **add** the exponents.',
      example: ['$(x^2)^4 = x^8$', '$(x^{-1})^3 = x^{-3}$', '$x^8 \\cdot x^{-3} = x^5$'],
      check: { q: 'Simplify $(x^3)^2 \\cdot (x^{-1})^4$.', options: ['$x^2$', '$x^{10}$', '$x^5$', '$x^{-2}$'], answer: 0, why: '$(x^3)^2 = x^6$ and $(x^{-1})^4 = x^{-4}$. Add: $6 + (-4) = 2$.' },
    },
    {
      say: 'Write the general term with each whole term in brackets: $t_{k + 1} = {}_nC_k (\\text{first})^{n - k} (\\text{second})^k$.',
      example: ['$\\left(2x - \\frac{1}{x}\\right)^6$', '$t_{k + 1} = {}_6C_k (2x)^{6 - k} \\left(-x^{-1}\\right)^k$'],
      check: { q: 'Which is the general term of $\\left(x^2 + \\frac{1}{x}\\right)^5$?', options: ['${}_5C_k (x^2)^{5 - k} (x^{-1})^k$', '$(x^2)^{5 - k} (x^{-1})^k$', '${}_5C_k (x^2)^{5 - k} (x)^k$', '${}_5C_k (x^2)^5 (x^{-1})^k$'], answer: 0, why: 'The first term gets power $5 - k$, the second term $x^{-1}$ gets power $k$, and ${}_5C_k$ goes in front.' },
    },
    {
      say: 'Find the power of $x$ in the general term. Multiply each exponent by its power, then add the results.',
      example: ['$\\left(2x - \\frac{1}{x}\\right)^6$', 'From $(2x)^{6 - k}$: $x^{6 - k}$.', 'From $\\left(-x^{-1}\\right)^k$: $x^{-k}$.', 'Power: $(6 - k) - k = 6 - 2k$.'],
      check: { q: 'What is the power of $x$ in the general term of $\\left(x^2 + \\frac{1}{x}\\right)^5$?', options: ['$10 - 3k$', '$10 - k$', '$5 - 3k$', '$10 + k$'], answer: 0, why: '$2(5 - k) + (-1)k = 10 - 2k - k = 10 - 3k$.' },
    },
    {
      say: 'The **constant term** has no $x$ in it, so its power of $x$ is 0. Set the power equal to 0 and solve for $k$.',
      example: ['In $\\left(2x - \\frac{1}{x}\\right)^6$ the power is $6 - 2k$.', '$6 - 2k = 0$', '$k = 3$', 'The constant term is $t_4$.'],
      check: { q: 'The power of $x$ in a general term is $12 - 3k$. Which $k$ gives the constant term?', options: ['$k = 4$', '$k = 12$', '$k = 3$', '$k = 9$'], answer: 0, why: '$12 - 3k = 0$ gives $3k = 12$, so $k = 4$.' },
    },
    {
      say: 'Put that $k$ back into the general term and work out the number. Watch the sign of the second term.',
      example: ['$t_4 = {}_6C_3 (2x)^3 \\left(-\\frac{1}{x}\\right)^3$', '$= 20 \\times 8x^3 \\times \\left(-\\frac{1}{x^3}\\right)$', '$= 20 \\times 8 \\times (-1)$', '$= -160$'],
      check: { q: 'What is the constant term of $\\left(x + \\frac{1}{x}\\right)^4$?', options: ['$6$', '$4$', '$1$', '$24$'], answer: 0, why: 'Power: $4 - 2k = 0$, so $k = 2$. ${}_4C_2 = 6$, and the powers of $x$ cancel, so the term is $6$.' },
    },
    {
      say: 'For any power $x^m$, set the power expression equal to $m$. If $k$ is not a whole number from 0 to $n$, there is **no such term**.',
      example: ['Term with $x^2$ in $\\left(2x - \\frac{1}{x}\\right)^6$.', '$6 - 2k = 2$, so $k = 2$.', '$t_3 = {}_6C_2 (2x)^4 \\left(-\\frac{1}{x}\\right)^2$', '$= 15 \\times 16x^4 \\times \\frac{1}{x^2} = 240x^2$'],
      check: { q: 'In $\\left(2x - \\frac{1}{x}\\right)^6$ the power of $x$ is $6 - 2k$. Is there an $x^3$ term?', options: ['No, because $k = 1.5$ is not a whole number', 'Yes, with $k = 3$', 'Yes, with $k = 1.5$', 'Yes, with $k = 2$'], answer: 0, why: '$6 - 2k = 3$ gives $k = 1.5$. $k$ must be a whole number, so there is no $x^3$ term.' },
    },
  ],

  'PCBT4.find-unknown': [
    {
      say: 'Some questions give you a term and ask for a missing number. Write the general term with the unknown left in. Then set it equal to the given term.',
      example: ['$(x + a)^5$, 2nd term, so $k = 1$.', '$t_2 = {}_5C_1 (x)^4 (a)^1$', '$= 5ax^4$'],
      check: { q: 'In $(x + a)^4$, what is the 2nd term, with $a$ left in?', options: ['$4ax^3$', '$4a^3x$', '$ax^3$', '$6a^2x^2$'], answer: 0, why: '$k = 1$: ${}_4C_1 (x)^3 (a)^1 = 4ax^3$.' },
    },
    {
      say: 'Match the numbers in front (the **coefficients**) and solve for the unknown.',
      example: ['The 2nd term of $(x + a)^5$ is $15x^4$.', '$5ax^4 = 15x^4$, so $5a = 15$.', '$a = 3$'],
      check: { q: 'The 2nd term of $(x + a)^6$ is $-12x^5$. Find $a$.', options: ['$a = -2$', '$a = 2$', '$a = -72$', '$a = \\pm 2$'], answer: 0, why: '$t_2 = 6ax^5$, so $6a = -12$ and $a = -2$. An odd power keeps the sign.' },
    },
    {
      say: 'If the unknown is raised to an **even** power, there are two answers, one positive and one negative. Keep both unless the question says otherwise.',
      example: ['The coefficient of $x^2$ in $(1 + ax)^5$ is $90$.', 'Term: ${}_5C_2 (ax)^2 = 10a^2x^2$.', '$10a^2 = 90$, so $a^2 = 9$.', '$a = \\pm 3$'],
      check: { q: 'The 3rd term of $(x + a)^4$ is $24x^2$. Find $a$.', options: ['$a = \\pm 2$', '$a = 2$', '$a = 4$', '$a = \\pm 4$'], answer: 0, why: '$t_3 = {}_4C_2\\, x^2 a^2 = 6a^2x^2$. $6a^2 = 24$, so $a^2 = 4$ and $a = \\pm 2$.' },
    },
    {
      say: 'If $n$ is unknown, the coefficient gives an equation in $n$. In $(1 + bx)^n$, the $x$ term is $t_2 = {}_nC_1 (bx) = bnx$.',
      example: ['In $(1 + 3x)^n$, the coefficient of $x$ is $24$.', '$t_2 = {}_nC_1 (3x) = 3nx$', '$3n = 24$', '$n = 8$'],
      check: { q: 'In $(1 + 2x)^n$, the coefficient of $x$ is $14$. Find $n$.', options: ['$7$', '$14$', '$12$', '$28$'], answer: 0, why: '$t_2 = {}_nC_1 (2x) = 2nx$. $2n = 14$, so $n = 7$.' },
    },
    {
      say: 'For the $x^2$ coefficient in $(1 + x)^n$, use ${}_nC_2 = \\frac{n(n - 1)}{2}$. Solve the quadratic and reject the negative root.',
      example: ['The coefficient of $x^2$ is $21$.', '$\\frac{n(n - 1)}{2} = 21$, so $n(n - 1) = 42$.', '$n^2 - n - 42 = 0$', '$(n - 7)(n + 6) = 0$, so $n = 7$.'],
      check: { q: 'In $(1 + x)^n$, the coefficient of $x^2$ is $10$. Find $n$.', options: ['$5$', '$-4$', '$10$', '$4$'], answer: 0, why: '$n(n - 1) = 20$ gives $(n - 5)(n + 4) = 0$. Reject $-4$, so $n = 5$.' },
    },
    {
      say: 'Use the power of $x$ first, because it often fixes $k$ or $n$. Then use the coefficient to check your answer.',
      example: ['The 2nd term of $(x + 2)^n$ is $12x^5$.', '$t_2 = {}_nC_1\\, x^{n - 1} (2) = 2nx^{n - 1}$', 'Powers: $n - 1 = 5$, so $n = 6$.', 'Check: $2(6) = 12$. It works.'],
      check: { q: 'The 2nd term of $(x + 3)^n$ is $12x^3$. Find $n$.', options: ['$4$', '$3$', '$12$', '$5$'], answer: 0, why: 'The power $n - 1 = 3$ gives $n = 4$. Check: $3 \\times 4 = 12$.' },
    },
    {
      say: 'If you know which term is the **constant term**, write its power of $x$, set it equal to 0, and solve for $n$.',
      example: ['The 3rd term of $\\left(x + \\frac{1}{x}\\right)^n$ is constant, so $k = 2$.', 'Power of $x$: $(n - 2) - 2$.', '$(n - 2) - 2 = 0$, so $n = 4$.'],
      check: { q: 'The 3rd term of $\\left(x + \\frac{1}{x^2}\\right)^n$ is the constant term. Find $n$.', options: ['$6$', '$4$', '$2$', '$8$'], answer: 0, why: '$k = 2$. Power: $(n - 2) - 2(2) = 0$, so $n - 6 = 0$ and $n = 6$.' },
    },
  ],
};
