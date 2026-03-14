# Design Spec Language

The intended flow is:

`idea -> design DSL -> design artifact -> UI implementation`

The DSL is not a rendering language. It is a structured contract for design intent that sits between planning and implementation.

Goals:

- preserve reasoning from idea to UI
- keep layout and state decisions explicit
- let Design Agent produce more than prose
- let Builder and Critic evaluate the same intermediate representation

Current status:

- starter schema and template only
- should be refined once 1 or 2 real screens have been modeled through it
