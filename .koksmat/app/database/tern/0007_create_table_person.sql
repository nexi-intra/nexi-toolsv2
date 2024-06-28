/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/   


-- sure sild

CREATE TABLE public.person
(
    id SERIAL PRIMARY KEY,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by character varying COLLATE pg_catalog."default"  ,

    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying COLLATE pg_catalog."default" ,

    deleted_at timestamp with time zone
    ,tenant character varying COLLATE pg_catalog."default"  NOT NULL
    ,searchindex character varying COLLATE pg_catalog."default"  NOT NULL
    ,name character varying COLLATE pg_catalog."default"  NOT NULL
    ,description character varying COLLATE pg_catalog."default" 
    ,email character varying COLLATE pg_catalog."default" 
    ,displayname character varying COLLATE pg_catalog."default" 
    ,firstname character varying COLLATE pg_catalog."default"  NOT NULL
    ,lastname character varying COLLATE pg_catalog."default"  NOT NULL
    ,uniqueid character varying COLLATE pg_catalog."default"  NOT NULL
    ,nationality_id int  


);

                ALTER TABLE IF EXISTS public.person
                ADD FOREIGN KEY (nationality_id)
                REFERENCES public.country (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;                -- lollipop
                CREATE TABLE public.person_m2m_relation (
                id SERIAL PRIMARY KEY,
                created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_by character varying COLLATE pg_catalog."default"  ,
                updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_by character varying COLLATE pg_catalog."default",
                deleted_at timestamp with time zone
                
                    ,person_id int  
 
                    ,relation_id int  
 

                );
            

                ALTER TABLE public.person_m2m_relation
                ADD FOREIGN KEY (person_id)
                REFERENCES public.person (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;

                ALTER TABLE public.person_m2m_relation
                ADD FOREIGN KEY (relation_id)
                REFERENCES public.relation (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;


---- create above / drop below ----
DROP TABLE IF EXISTS public.person_m2m_relation;
DROP TABLE public.person;

