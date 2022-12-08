import { IOmdbResponse } from "../../src/ts/models/IOmdbResponse";

const testData: IOmdbResponse = {
  Search: [
    {
      Title: "Harry Potter 1",
      imdbID: "1",
      Type: "Movie",
      Poster: "Harry Potter 1",
      Year: "2001",
    },
    {
      Title: "Harry Potter 2",
      imdbID: "2",
      Type: "Movie",
      Poster: "Harry Xotter 2",
      Year: "2002",
    },
    {
      Title: "Harry Potter 3",
      imdbID: "2",
      Type: "Movie",
      Poster: "Harry Potter 3",
      Year: "2002",
    },
    {
      Title: "Harry Potter 4",
      imdbID: "3",
      Type: "Movie",
      Poster: "Harry Potter 4",
      Year: "2003",
    },
  ],
};

beforeEach(() => {
  cy.visit("/");
});

describe("movie app", () => {
  it("should be able to type", () => {
    cy.get("input").type("hej").should("have.value", "hej");
  });

  it("should use real data", () => {
    cy.get("input").type("harry");
    cy.get("button").click();

    cy.get("div#movie-container> div.movie").should("have.length", 10);
  });

  it("should  add classname", () => {
    cy.get("input").type("hej");
    cy.get("input#searchText").should("have.value", "hej");
    cy.intercept("GET", "http://omdbapi.com/*", testData);

    cy.get("form").submit();
    cy.get("div#movie-container > div").should("have.class", "movie");
  });

  it("should  click and use testData", () => {
    cy.get("input").type("hej");
    cy.get("input#searchText").should("have.value", "hej");
    cy.intercept("GET", "http://omdbapi.com/*", testData);

    cy.get("form").submit();
    cy.get("div#movie-container> div.movie").should("have.length", 4);
  });

  it("should contain hej in the call", () => {
    cy.get("input").type("hej");
    cy.get("input#searchText").should("have.value", "hej");
    cy.intercept("GET", "http://omdbapi.com/*", testData);
    cy.intercept("GET", "http://omdbapi.com/*", testData).as("moviecall");

    cy.get("form").submit();

    cy.wait("@moviecall").its("request.url").should("contain", "hej");
  });

  it("should have h3 and img", () => {
    cy.get("input").type("hej");
    cy.get("input#searchText").should("have.value", "hej");
    cy.intercept("GET", "http://omdbapi.com/*", testData);

    cy.get("form").submit();

    cy.get("div#movie-container > div").should("have.class", "movie");
    cy.get("div.movie").contains("<h3>", "<img>");
  });

  it("should give error when input.value<3", () => {
    cy.get("input").type("he");
    cy.get("input#searchText").should("have.value", "he");

    cy.get("form").submit();
    cy.get("div#movie-container > p").should(
      "contain",
      "Inga sökresultat att visa"
    );
  });

  it("should give error when input.value is empty", () => {
    cy.get("input#searchText").should("be.empty");

    cy.get("form").submit();

    cy.get("div#movie-container > p").should(
      "contain",
      "Inga sökresultat att visa"
    );
  });

  it("should give no result", () => {
    cy.get("input").type("hej");
    cy.get("input#searchText").should("have.value", "hej");
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.intercept("GET", "http://omdbapi.com/*", {}).as("moviecall");

    cy.get("form").submit();

    cy.wait("@moviecall").its("request.url").should("contain", "s=hej");
  });

  it("should find error message", () => {
    cy.get("input").type("hej");
    cy.get("input#searchText").should("have.value", "hej");
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.intercept("GET", "http://omdbapi.com/*", {}).as("moviecall");

    cy.get("form").submit();
    cy.get("div#movie-container > p").should(
      "contain",
      "Inga sökresultat att visa"
    );
  });
});
