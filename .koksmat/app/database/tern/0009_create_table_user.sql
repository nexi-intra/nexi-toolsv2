/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/   


-- sure sild

CREATE TABLE public.user
(
    id SERIAL PRIMARY KEY,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by character varying COLLATE pg_catalog."default"  ,

    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying COLLATE pg_catalog."default" ,

    deleted_at timestamp with time zone,
    koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
    koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
    koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
    koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
    koksmat_state VARCHAR COLLATE pg_catalog."default",


    koksmat_bucket JSONB 

    ,tenant character varying COLLATE pg_catalog."default"  NOT NULL
    ,searchindex character varying COLLATE pg_catalog."default"  NOT NULL
    ,name character varying COLLATE pg_catalog."default"  NOT NULL
    ,description character varying COLLATE pg_catalog."default" 
    ,email character varying COLLATE pg_catalog."default"  NOT NULL
    ,firstname character varying COLLATE pg_catalog."default"  NOT NULL
    ,lastname character varying COLLATE pg_catalog."default"  NOT NULL
    ,language_id int   NOT NULL
    ,country_id int   NOT NULL
    ,region_id int   NOT NULL
    ,status character varying COLLATE pg_catalog."default"  NOT NULL


);

                ALTER TABLE IF EXISTS public.user
                ADD FOREIGN KEY (language_id)
                REFERENCES public.language (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;                ALTER TABLE IF EXISTS public.user
                ADD FOREIGN KEY (country_id)
                REFERENCES public.country (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;                ALTER TABLE IF EXISTS public.user
                ADD FOREIGN KEY (region_id)
                REFERENCES public.region (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;                -- lollipop
                CREATE TABLE public.user_m2m_tool (
                id SERIAL PRIMARY KEY,
                created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_by character varying COLLATE pg_catalog."default"  ,
                updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_by character varying COLLATE pg_catalog."default",
                deleted_at timestamp with time zone,
                koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
                koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
                koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
                koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
                koksmat_state VARCHAR COLLATE pg_catalog."default",

                koksmat_bucket JSONB 
                    ,user_id int  
 
                    ,tool_id int  
 

                );
            

                ALTER TABLE public.user_m2m_tool
                ADD FOREIGN KEY (user_id)
                REFERENCES public.user (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;

                ALTER TABLE public.user_m2m_tool
                ADD FOREIGN KEY (tool_id)
                REFERENCES public.tool (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;


---- create above / drop below ----
DROP TABLE IF EXISTS public.user_m2m_tool;
DROP TABLE public.user;

