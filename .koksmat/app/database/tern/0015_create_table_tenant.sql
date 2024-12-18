/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/   


-- sure sild

CREATE TABLE public.tenant
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
    ,Translations JSONB  
    ,status character varying COLLATE pg_catalog."default" 
    ,metadata JSONB  


);

                -- lollipop
                CREATE TABLE public.tenant_m2m_userrole (
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
                    ,tenant_id int  
 
                    ,userrole_id int  
 

                );
            

                ALTER TABLE public.tenant_m2m_userrole
                ADD FOREIGN KEY (tenant_id)
                REFERENCES public.tenant (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;

                ALTER TABLE public.tenant_m2m_userrole
                ADD FOREIGN KEY (userrole_id)
                REFERENCES public.userrole (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;                -- lollipop
                CREATE TABLE public.tenant_m2m_usergroup (
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
                    ,tenant_id int  
 
                    ,usergroup_id int  
 

                );
            

                ALTER TABLE public.tenant_m2m_usergroup
                ADD FOREIGN KEY (tenant_id)
                REFERENCES public.tenant (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;

                ALTER TABLE public.tenant_m2m_usergroup
                ADD FOREIGN KEY (usergroup_id)
                REFERENCES public.usergroup (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;                -- lollipop
                CREATE TABLE public.tenant_m2m_userprofile (
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
                    ,tenant_id int  
 
                    ,userprofile_id int  
 

                );
            

                ALTER TABLE public.tenant_m2m_userprofile
                ADD FOREIGN KEY (tenant_id)
                REFERENCES public.tenant (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;

                ALTER TABLE public.tenant_m2m_userprofile
                ADD FOREIGN KEY (userprofile_id)
                REFERENCES public.userprofile (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID;


---- create above / drop below ----
DROP TABLE IF EXISTS public.tenant_m2m_userrole;DROP TABLE IF EXISTS public.tenant_m2m_usergroup;DROP TABLE IF EXISTS public.tenant_m2m_userprofile;
DROP TABLE public.tenant;

