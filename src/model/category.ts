import { Type, Transform } from 'class-transformer';
import moment from 'moment';
import { Moment } from 'moment';

export class CategorisationResultCollection extends Array<CategorisationResult> {
    // custom array functions ...
}

export class CategorisationResult {
    id: Number;
    certainty: Number;
    source: string;
    tag: string;
    level: Number;

    @Transform(({value})=>moment(value),{toClassOnly:true})
    created: Moment;
    
}

export class CategoryCollection extends Array<Category> {
    // custom array functions ...
}

export class Category{
    tag:string;
    categorySource: string;
    @Type(() => Category)
    children: CategoryCollection;
    parent:string| null; // tag
    avatar:string;
    background: string;
    backgroundDark: string;
    foreground: string;
    foregroundDark: string;
    translation:string;
}