<details>
  <summary>📐 High-Level Design (Mermaid)</summary>

  ```mermaid
  graph TD
    A[User (Browser)]
    A --> B[Frontend (HTML/CSS)]
    B --> C[Forms / Buttons / Links]
    C --> D[Express Server (Node.js)]

    D --> E1[GET /products]
    D --> E2[POST /cart/add]
    D --> E3[DELETE /cart/remove]
    D --> E4[POST /submit-form]

    E1 --> F1[products.json (Mock Data)]
    E2 --> F2[cart.json (Mock Cart DB)]
    E3 --> F2
    E4 --> F3[submissions.json (Mock Form DB)]
